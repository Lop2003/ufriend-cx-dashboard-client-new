import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomers } from '../../hooks/useCustomers';
import { useAddFollowUp } from '../../hooks/useAddFollowUp';
import { PATHS } from '../../routes/paths';
import FollowUpForm from './components/FollowUpForm';
import CustomerDetailModal from '../customers/components/CustomerDetailModal';

export default function FollowUpPage() {
  const navigate = useNavigate();

  const [searchVal, setSearchVal] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showModalId, setShowModalId] = useState('');

  // Debounce การค้นหาฝั่งเซิร์ฟเวอร์
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchVal);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchVal]);

  const { customers, isLoading: searchLoading } = useCustomers({
    search: debouncedSearch,
    sortBy: 'name',
    sortOrder: 'asc',
    limit: 100, // โหลดสูงสุด 100 รายการต่อการค้นหา
  });

  const {
    customerId, setCustomerId,
    type, setType,
    note, setNote,
    error, setError,
    isSubmitting,
    handleSubmit,
    selectedCust,
  } = useAddFollowUp({
    customers,
    onSuccess: (id) => setShowModalId(id),
  });

  return (
    <>
      <FollowUpForm
        customers={customers}
        customerId={customerId}
        setCustomerId={setCustomerId}
        type={type}
        setType={setType}
        note={note}
        setNote={setNote}
        error={error ?? ''}
        setError={setError}
        isSubmitting={isSubmitting}
        handleSubmit={handleSubmit}
        selectedCust={selectedCust}
        onSearchChange={setSearchVal}
        searchLoading={searchLoading}
        onCancel={() => navigate(PATHS.CUSTOMERS)}
      />
      {!!showModalId && (
        <CustomerDetailModal
          selectedCustomerId={showModalId}
          isOpen={!!showModalId}
          onClose={() => setShowModalId('')}
        />
      )}
    </>
  );
}
