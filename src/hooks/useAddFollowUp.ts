import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { createFollowUp } from '../services/followUpMutations';
import { fetchCustomerDetail } from '../services/customerService';
import { useToast } from '../components/Toast';
import type { Customer, UseAddFormOptions } from '../types';

export function useAddFollowUp(options: UseAddFormOptions & { onSuccess?: (id: string) => void } = {}) {
  const { customers = [], onSuccess } = options;
  const location = useLocation();
  const { showToast } = useToast();

  // รองรับการดึง customerId จากทั้ง location state และ URL query parameter
  const searchParams = new URLSearchParams(location.search);
  const queryCustomerId = searchParams.get('customerId');
  const routerCustomerId = location.state?.customerId || queryCustomerId || '';

  const [customerId, setCustomerId] = useState(routerCustomerId);
  const [type, setType] = useState('payment_remind');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCust, setSelectedCust] = useState<Customer | null>(null);

  useEffect(() => {
    if (routerCustomerId) {
      setCustomerId(routerCustomerId);
    }
  }, [routerCustomerId]);

  // คอยตรวจสอบและดึงรายละเอียดผู้ใช้ที่ถูกเลือกหากไม่มีใน List ปกติ
  useEffect(() => {
    if (!customerId) {
      setSelectedCust(null);
      return;
    }
    const found = customers.find((c: Customer) => c.id === customerId);
    if (found) {
      setSelectedCust(found);
    } else {
      let active = true;
      fetchCustomerDetail(customerId)
        .then(res => {
          if (active && res) {
            setSelectedCust(res);
          }
        })
        .catch(err => console.error("Failed to fetch customer detail:", err));
      return () => { active = false; };
    }
  }, [customerId, customers]);

  // Auto-switch to payment_remind when overdue customer selected
  useEffect(() => {
    if (selectedCust?.status === 'overdue') {
      setType('payment_remind');
    }
  }, [customerId, selectedCust]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!customerId) { setError('กรุณาเลือกรายชื่อลูกค้าเพื่อบันทึกการติดตาม'); return; }
    if (!note.trim()) { setError('กรุณากรอกบันทึกรายละเอียดการโทรติดตามลูกค้า'); return; }

    setIsSubmitting(true);
    try {
      await createFollowUp({
        customer_id: customerId,
        type,
        note: note.trim()
      });
      showToast('success', 'บันทึกการติดตามเรียบร้อยแล้ว');
      setError('');
      setNote('');
      if (onSuccess) {
        onSuccess(customerId);
      }
    } catch (err: any) {
      showToast('error', `บันทึกไม่สำเร็จ: ${err?.message ?? 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    customerId,
    setCustomerId,
    type,
    setType,
    note,
    setNote,
    error,
    setError,
    isSubmitting,
    handleSubmit,
    selectedCust,
  };
}

export default useAddFollowUp;
