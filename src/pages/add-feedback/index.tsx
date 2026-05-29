import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomers } from '../../hooks/useCustomers';
import { useAddFeedback } from '../../hooks/useAddFeedback';
import { PATHS } from '../../routes/paths';
import FeedbackForm from './components/FeedbackForm';

export default function AddFeedbackPage() {
  const navigate = useNavigate();
  
  const [searchVal, setSearchVal] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

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
    rating, setRating,
    hoverRating, setHoverRating,
    comment, setComment,
    category, setCategory,
    error, setError,
    isSubmitting,
    handleSubmit,
    selectedCust,
  } = useAddFeedback({ customers });

  return (
    <FeedbackForm
      customers={customers}
      customerId={customerId}
      setCustomerId={setCustomerId}
      rating={rating}
      setRating={setRating}
      hoverRating={hoverRating}
      setHoverRating={setHoverRating}
      comment={comment}
      setComment={setComment}
      category={category}
      setCategory={setCategory}
      error={error ?? ''}
      setError={setError}
      isSubmitting={isSubmitting}
      handleSubmit={handleSubmit}
      selectedCust={selectedCust}
      onSearchChange={setSearchVal}
      searchLoading={searchLoading}
      onCancel={() => navigate(PATHS.CUSTOMERS)}
    />
  );
}
