import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import ProgramTable from '../components/ProgramTable';
import ProgramModal from '../components/ProgramModal';
import { Plus, RefreshCw } from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';

export interface FrequentFlyerProgram {
  _id: string;
  name: string;
  assetName: string;
  enabled: boolean;
  archived: boolean;
  createdAt: string;
  modifiedAt: string;
  transferRatios?: TransferRatio[];
}

export interface CreditCard {
  _id: string;
  name: string;
  bankName: string;
  archived: boolean;
  createdAt: string;
  modifiedAt: string;
}

export interface TransferRatio {
  _id: string;
  programId: string;
  creditCardId: string | CreditCard;
  ratio: number;
  archived: boolean;
  createdAt: string;
  modifiedAt: string;
  creditCard?: CreditCard;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [programs, setPrograms] = useState<FrequentFlyerProgram[]>([]);
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<FrequentFlyerProgram | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await Promise.all([fetchPrograms(), fetchCreditCards()]);
  };

  const fetchPrograms = async () => {
    try {
      const response = await api.get('/api/ffps');
      setPrograms(response.data);
    } catch (error: any) {
      console.error('Failed to fetch programs:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch programs');
    } finally {
      setLoading(false);
    }
  };

  const fetchCreditCards = async () => {
    try {
      const response = await api.get('/api/credit-cards');
      setCreditCards(response.data);
    } catch (error: any) {
      console.error('Failed to fetch credit cards:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch credit cards');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
    toast.success('Data refreshed successfully');
  };

  const handleAddProgram = () => {
    setEditingProgram(null);
    setIsModalOpen(true);
  };

  const handleEditProgram = (program: FrequentFlyerProgram) => {
    setEditingProgram(program);
    setIsModalOpen(true);
  };

  const handleDeleteProgram = async (programId: string) => {
    if (!confirm('Are you sure you want to archive this program? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/api/ffps/${programId}`);
      toast.success('Program archived successfully');
      fetchPrograms();
    } catch (error: any) {
      console.error('Failed to archive program:', error);
      toast.error(error.response?.data?.message || 'Failed to archive program');
    }
  };

  const handleToggleEnabled = async (programId: string, enabled: boolean) => {
    try {
      await api.put(`/api/ffps/${programId}`, { enabled });
      toast.success(`Program ${enabled ? 'enabled' : 'disabled'} successfully`);
      fetchPrograms();
    } catch (error: any) {
      console.error('Failed to update program:', error);
      toast.error(error.response?.data?.message || 'Failed to update program');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingProgram(null);
    fetchPrograms();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8 mt-16">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4 sm:gap-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Manage your frequent flyer programs and transfer ratios
            </p>
            <div className="flex flex-wrap items-center space-x-2 sm:space-x-4 mt-2 text-xs sm:text-sm text-gray-500">
              <span>{programs.length} programs</span>
              <span className="hidden sm:inline">•</span>
              <span>{creditCards.length} credit cards</span>
              <span className="hidden sm:inline">•</span>
              <span>Welcome, {user?.username}</span>
            </div>
          </div>
          <div className="flex flex sm:flex-row sm:items-center gap-2 sm:gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="btn-secondary flex items-center justify-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleAddProgram}
              className="btn-primary flex items-center justify-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Program</span>
            </button>
          </div>
        </div>

        <div className="card p-2 sm:p-6 overflow-x-auto">
          <div className="mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Frequent Flyer Programs</h2>
            <p className="text-xs sm:text-sm text-gray-600">
              Manage your airline loyalty programs and their credit card transfer ratios
            </p>
          </div>
          
          <ProgramTable
            programs={programs}
            onEdit={handleEditProgram}
            onDelete={handleDeleteProgram}
            onToggleEnabled={handleToggleEnabled}
          />
        </div>
      </main>

      {isModalOpen && (
        <ProgramModal
          program={editingProgram}
          creditCards={creditCards}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default Dashboard;