import React, { useState, useEffect } from 'react';
import { FrequentFlyerProgram, CreditCard } from '../pages/Dashboard';
import { X, Plus, Trash2 } from 'lucide-react';
import ImageUpload from './ImageUpload';
import api from '../api';
import toast from 'react-hot-toast';

interface ProgramModalProps {
  program: FrequentFlyerProgram | null;
  creditCards: CreditCard[];
  onClose: () => void;
}

interface RatioFormData {
  creditCardId: string;
  ratio: number;
  _id?: string;
}

const ProgramModal: React.FC<ProgramModalProps> = ({ program, creditCards, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    assetName: '',
    enabled: true,
  });
  const [ratios, setRatios] = useState<RatioFormData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (program) {
      setFormData({
        name: program.name,
        assetName: program.assetName || '',
        enabled: program.enabled,
      });
      fetchProgramRatios(program._id);
    } else {
      setRatios([{ creditCardId: '', ratio: 1 }]);
    }
  }, [program]);

  const fetchProgramRatios = async (programId: string) => {
    try {
      const response = await api.get(`/api/ratios/${programId}`);
      const fetchedRatios = response.data.map((ratio: any) => ({
        _id: ratio._id,
        creditCardId: ratio.creditCardId._id || ratio.creditCardId,
        ratio: ratio.ratio,
      }));
      setRatios(fetchedRatios.length > 0 ? fetchedRatios : [{ creditCardId: '', ratio: 1 }]);
    } catch (error) {
      console.error('Failed to fetch ratios:', error);
      setRatios([{ creditCardId: '', ratio: 1 }]);
    }
  };

  const handleImageChange = (url: string) => {
    setFormData({ ...formData, assetName: url });
  };

  const addRatio = () => {
    setRatios([...ratios, { creditCardId: '', ratio: 1 }]);
  };

  const removeRatio = (index: number) => {
    if (ratios.length > 1) {
      setRatios(ratios.filter((_, i) => i !== index));
    }
  };

  const updateRatio = (index: number, field: keyof RatioFormData, value: string | number) => {
    const updated = [...ratios];
    updated[index] = { ...updated[index], [field]: value };
    setRatios(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form data
      if (!formData.name.trim()) {
        toast.error('Program name is required');
        return;
      }

      const programData = {
        name: formData.name.trim(),
        assetName: formData.assetName,
        enabled: formData.enabled,
      };

      let programId: string;

      if (program) {
        // Update existing program
        const response = await api.put(`/api/ffps/${program._id}`, programData);
        programId = program._id;
        toast.success('Program updated successfully');
      } else {
        // Create new program
        const response = await api.post('/api/ffps', programData);
        programId = response.data._id;
        toast.success('Program created successfully');
      }

      // Update ratios
      const validRatios = ratios.filter(r => r.creditCardId && r.ratio >= 0);
      
      for (const ratio of validRatios) {
        try {
          const ratioData = {
            programId,
            creditCardId: ratio.creditCardId,
            ratio: ratio.ratio,
          };

          if (ratio._id) {
            // Update existing ratio
            await api.put(`/api/ratios/${ratio._id}`, { ratio: ratio.ratio });
          } else {
            // Create new ratio
            await api.post('/api/ratios', ratioData);
          }
        } catch (ratioError: any) {
          console.error('Error saving ratio:', ratioError);
          // Don't fail the entire operation for ratio errors
          toast.error(`Failed to save ratio for one credit card`);
        }
      }

      onClose();
    } catch (error: any) {
      console.error('Error saving program:', error);
      toast.error(error.response?.data?.message || 'Failed to save program');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            {program ? 'Edit Program' : 'Add New Program'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Program Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              placeholder="Enter program name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Program Logo
            </label>
            <ImageUpload
              value={formData.assetName}
              onChange={handleImageChange}
              folder="programs"
              placeholder="Upload program logo"
              className="w-full"
            />
            <p className="text-sm text-gray-500 mt-2">
              Upload a logo for this frequent flyer program. Recommended size: 200x200px
            </p>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="enabled"
              checked={formData.enabled}
              onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="enabled" className="ml-2 block text-sm text-gray-700">
              Enable this program
            </label>
          </div>

          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Credit Card Transfer Ratios</h3>
              <button
                type="button"
                onClick={addRatio}
                className="btn-secondary flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Ratio</span>
              </button>
            </div>

            <div className="space-y-3">
              {ratios.map((ratio, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <select
                      value={ratio.creditCardId}
                      onChange={(e) => updateRatio(index, 'creditCardId', e.target.value)}
                      className="input-field"
                      required
                    >
                      <option value="">Select Credit Card</option>
                      {creditCards.map((card) => (
                        <option key={card._id} value={card._id}>
                          {card.name} - {card.bankName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-24">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={ratio.ratio}
                      onChange={(e) => updateRatio(index, 'ratio', parseFloat(e.target.value) || 0)}
                      className="input-field text-center"
                      placeholder="1.0"
                      required
                    />
                  </div>
                  {ratios.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRatio(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            {ratios.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                <p>No transfer ratios configured.</p>
                <button
                  type="button"
                  onClick={addRatio}
                  className="btn-secondary mt-2"
                >
                  Add First Ratio
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </div>
              ) : (
                program ? 'Update Program' : 'Create Program'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProgramModal;