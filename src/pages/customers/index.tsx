import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CustomerStatCards from './components/CustomerStatCards';
import CustomerFilterBar from './components/CustomerFilterBar';
import CustomerTable from './components/CustomerTable';
import CustomerDetailModal from './components/CustomerDetailModal';

import { useCustomers } from '../../hooks/useCustomers';
import { useBranches } from '../../hooks/useBranches';
import { useCustomerFilters } from '../../hooks/useCustomerFilters';

export default function CustomersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCustomerId = searchParams.get('id');

  const {
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
  } = useCustomerFilters();

  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search query to reduce excessive API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const {
    customers,
    total,
    page,
    limit,
    setPage,
    setLimit,
    isLoading,
  } = useCustomers({
    search: debouncedSearch,
    branch: selectedBranch,
    status: selectedStatus,
    sortBy,
    sortOrder,
  });

  const { branches } = useBranches();

  // Combined loading state: true when debouncing search OR when API is loading
  const isSearching = searchQuery !== debouncedSearch;
  const showLoading = isLoading || isSearching;

  return (
    <div className="flex flex-col gap-6 text-left">
      
      {/* Quick Stats */}
      <CustomerStatCards
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      {/* Filter Bar */}
      <CustomerFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedBranch={selectedBranch}
        setSelectedBranch={setSelectedBranch}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        branches={branches}
        isLoading={showLoading}
        resetFilters={resetFilters}
        hasFilters={hasFilters}
      />

      {/* Table */}
      <CustomerTable
        customers={customers}
        total={total}
        page={page}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={setLimit}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        onRowClick={(id) => setSearchParams({ id })}
        isLoading={showLoading}
      />

      {/* Detail Modal */}
      {!!selectedCustomerId && (
        <CustomerDetailModal
          selectedCustomerId={selectedCustomerId}
          isOpen={!!selectedCustomerId}
          onClose={() => setSearchParams({})}
        />
      )}

    </div>
  );
}
