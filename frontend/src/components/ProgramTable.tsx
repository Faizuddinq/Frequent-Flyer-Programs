import React from 'react';
import { FrequentFlyerProgram } from '../pages/Dashboard';
import { Edit, Trash2, Image, Calendar, ToggleLeft, ToggleRight } from 'lucide-react';

interface ProgramTableProps {
  programs: FrequentFlyerProgram[];
  onEdit: (program: FrequentFlyerProgram) => void;
  onDelete: (programId: string) => void;
  onToggleEnabled: (programId: string, enabled: boolean) => void;
}

const ProgramTable: React.FC<ProgramTableProps> = ({
  programs,
  onEdit,
  onDelete,
  onToggleEnabled,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (programs.length === 0) {
    return (
      <div className="text-center py-12">
        <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No programs found</h3>
        <p className="text-gray-500">Get started by adding your first frequent flyer program.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-left py-3 px-4 font-semibold text-gray-900">Program</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-900">Logo</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-900">Created</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-900">Modified</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
          </tr>
        </thead>
        <tbody>
          {programs.map((program) => (
            <tr key={program._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="py-4 px-4">
                <div>
                  <div className="font-medium text-gray-900">{program.name}</div>
                  <div className="text-sm text-gray-500">ID: {program._id.slice(-6)}</div>
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                  {program.assetName ? (
                    <img
                      src={program.assetName}
                      alt={program.name}
                      className="w-8 h-8 object-contain rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : (
                    <Image className="h-5 w-5 text-gray-400" />
                  )}
                  <div className="hidden">
                    <Image className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </td>
              <td className="py-4 px-4">
                <button
                  onClick={() => onToggleEnabled(program._id, !program.enabled)}
                  className="flex items-center space-x-1 hover:opacity-80 transition-opacity"
                >
                  {program.enabled ? (
                    <>
                      <ToggleRight className="h-6 w-6 text-green-500" />
                      <span className="text-green-700 font-medium">Enabled</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="h-6 w-6 text-gray-400" />
                      <span className="text-gray-500 font-medium">Disabled</span>
                    </>
                  )}
                </button>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center space-x-1 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">{formatDate(program.createdAt)}</span>
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center space-x-1 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">{formatDate(program.modifiedAt)}</span>
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onEdit(program)}
                    className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    title="Edit program"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(program._id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Archive program"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProgramTable;