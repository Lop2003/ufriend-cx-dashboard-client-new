import { useState, useEffect, useCallback } from 'react';
import { fetchCustomerDetail } from '../services/customerService';

export function useCustomerDetail(selectedCustomerId: string | null) {
  const [customer, setCustomer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadDetail = useCallback(() => {
    if (!selectedCustomerId) {
      setCustomer(null);
      return () => {};
    }
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    fetchCustomerDetail(selectedCustomerId)
      .then(data => {
        if (!cancelled) setCustomer(data);
      })
      .catch((err) => {
        console.error('Failed to load customer details:', err);
        if (!cancelled) {
          setError('ไม่สามารถโหลดข้อมูลประวัติลูกค้าได้');
          setCustomer(null);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => { cancelled = true; };
  }, [selectedCustomerId]);

  useEffect(() => {
    const cancel = loadDetail();
    return cancel;
  }, [loadDetail]);

  return {
    customer,
    isLoading,
    error,
    refetch: loadDetail,
  };
}

export default useCustomerDetail;
