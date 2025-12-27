import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Settings, Plus, Edit, Trash2, Save, X, Loader2 } from 'lucide-react';
import { adminApi, testApi } from '@/services/api';
import toast from 'react-hot-toast';
import { cn } from '@/utils/cn';
import type { CodingTest } from '@/types';

const AdminPanel: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<CodingTest>>({
    title: '',
    description: '',
    difficulty: 'easy',
    maxScore: 100,
    unlockLevel: 1,
    hintCost: 10,
    testCases: [{ input: '', expectedOutput: '' }],
  });

  const queryClient = useQueryClient();

  const { data: tests, isLoading } = useQuery({
    queryKey: ['adminTests'],
    queryFn: testApi.getAllTests,
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<CodingTest>) => adminApi.createTest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTests'] });
      setIsCreating(false);
      resetForm();
      toast.success('Test created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create test');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CodingTest> }) =>
      adminApi.updateTest(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTests'] });
      setEditingId(null);
      resetForm();
      toast.success('Test updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update test');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteTest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTests'] });
      toast.success('Test deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete test');
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      difficulty: 'easy',
      maxScore: 100,
      unlockLevel: 1,
      hintCost: 10,
      testCases: [{ input: '', expectedOutput: '' }],
    });
  };

  const handleEdit = (test: CodingTest) => {
    setEditingId(test._id);
    setFormData({
      title: test.title,
      description: test.description,
      difficulty: test.difficulty,
      maxScore: test.maxScore,
      unlockLevel: test.unlockLevel,
      hintCost: test.hintCost,
      testCases: test.testCases.length > 0 ? test.testCases : [{ input: '', expectedOutput: '' }],
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title?.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!formData.description?.trim()) {
      toast.error('Description is required');
      return;
    }
    if (!formData.testCases || formData.testCases.length === 0) {
      toast.error('At least one test case is required');
      return;
    }
    if (formData.testCases.some(tc => !tc.input || !tc.expectedOutput)) {
      toast.error('All test cases must have both input and expected output');
      return;
    }
    
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const addTestCase = () => {
    setFormData({
      ...formData,
      testCases: [...(formData.testCases || []), { input: '', expectedOutput: '' }],
    });
  };

  const removeTestCase = (index: number) => {
    const newTestCases = formData.testCases?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, testCases: newTestCases });
  };

  const updateTestCase = (index: number, field: 'input' | 'expectedOutput', value: string) => {
    const newTestCases = [...(formData.testCases || [])];
    newTestCases[index] = { ...newTestCases[index], [field]: value };
    setFormData({ ...formData, testCases: newTestCases });
  };

  const difficultyColors = {
    easy: 'bg-green-500/20 text-green-400 border-green-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    hard: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Admin Panel</h1>
            <p className="text-white/60">Manage coding tests</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setIsCreating(true);
            resetForm();
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-purple-600 text-white font-semibold rounded-lg hover:from-primary-600 hover:to-purple-700 transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Create Test</span>
        </motion.button>
      </motion.div>

      {/* Create/Edit Form */}
      {(isCreating || editingId) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">
              {editingId ? 'Edit Test' : 'Create New Test'}
            </h2>
            <button
              onClick={() => {
                setIsCreating(false);
                setEditingId(null);
                resetForm();
              }}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white/70" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Difficulty</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) =>
                    setFormData({ ...formData, difficulty: e.target.value as 'easy' | 'medium' | 'hard' })
                  }
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={4}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Max Score</label>
                <input
                  type="number"
                  value={formData.maxScore}
                  onChange={(e) => setFormData({ ...formData, maxScore: parseInt(e.target.value) })}
                  required
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Unlock Level</label>
                <input
                  type="number"
                  value={formData.unlockLevel}
                  onChange={(e) => setFormData({ ...formData, unlockLevel: parseInt(e.target.value) })}
                  required
                  min={1}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Hint Cost</label>
                <input
                  type="number"
                  value={formData.hintCost}
                  onChange={(e) => setFormData({ ...formData, hintCost: parseInt(e.target.value) })}
                  required
                  min={0}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-white/80">Test Cases</label>
                <button
                  type="button"
                  onClick={addTestCase}
                  className="text-sm text-primary-400 hover:text-primary-300"
                >
                  + Add Test Case
                </button>
              </div>
              <div className="space-y-2">
                {formData.testCases?.map((testCase, index) => (
                  <div key={index} className="grid grid-cols-2 gap-2 p-3 bg-white/5 rounded-lg">
                    <input
                      type="text"
                      value={testCase.input}
                      onChange={(e) => updateTestCase(index, 'input', e.target.value)}
                      placeholder="Input"
                      className="px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={testCase.expectedOutput}
                        onChange={(e) => updateTestCase(index, 'expectedOutput', e.target.value)}
                        placeholder="Expected Output"
                        className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      {formData.testCases && formData.testCases.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTestCase(index)}
                          className="p-2 hover:bg-red-500/20 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-primary-500 to-purple-600 text-white font-semibold rounded-lg hover:from-primary-600 hover:to-purple-700 transition-all disabled:opacity-50"
              >
                {(createMutation.isPending || updateMutation.isPending) ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                <span>{editingId ? 'Update' : 'Create'}</span>
              </motion.button>
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setEditingId(null);
                  resetForm();
                }}
                className="px-6 py-2 bg-white/5 text-white/70 rounded-lg hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Tests List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-6"
      >
        <h2 className="text-xl font-semibold text-white mb-4">All Tests ({tests?.length || 0})</h2>
        <div className="space-y-3">
          {tests?.map((test, index) => (
            <motion.div
              key={test._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-primary-500/50 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{test.title}</h3>
                    <span
                      className={cn(
                        'px-2 py-1 rounded text-xs font-medium border',
                        difficultyColors[test.difficulty]
                      )}
                    >
                      {test.difficulty}
                    </span>
                  </div>
                  <p className="text-white/60 text-sm mb-2">{test.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-white/50">
                    <span>Max Score: {test.maxScore}</span>
                    <span>Unlock Level: {test.unlockLevel}</span>
                    <span>Hint Cost: {test.hintCost} pts</span>
                    <span>Test Cases: {test.testCases?.length || 0}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(test)}
                    className="p-2 hover:bg-primary-500/20 rounded-lg transition-colors"
                  >
                    <Edit className="w-5 h-5 text-primary-400" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this test?')) {
                        deleteMutation.mutate(test._id);
                      }
                    }}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-red-400" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        {tests?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/60">No tests found. Create your first test!</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminPanel;

