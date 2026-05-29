import { useState, useCallback } from 'react';

export function useCustomerFilters() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedBranch('');
    setSelectedStatus('');
    setSortBy('created_at');
    setSortOrder('desc');
  }, []);

  const hasFilters = !!(searchQuery || selectedBranch || selectedStatus);

  return {
    searchQuery,
    setSearchQuery,
    selectedBranch,
    setSelectedBranch,
    selectedStatus,
    setSelectedStatus,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    resetFilters,
    hasFilters,
  };
}

export default useCustomerFilters;
