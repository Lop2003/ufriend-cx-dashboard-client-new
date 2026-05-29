import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createFeedback } from '../services/feedbackMutations';
import { fetchCustomerDetail } from '../services/customerService';
import { useToast } from '../components/Toast';
import { PATHS } from '../routes/paths';

export function useAddFeedback(options: any = {}) {
  const { customers = [] } = options;
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  // รองรับการดึง customerId จากทั้ง location state และ URL query parameter
  const searchParams = new URLSearchParams(location.search);
  const queryCustomerId = searchParams.get('customerId');
  const routerCustomerId = location.state?.customerId || queryCustomerId || '';

  const [customerId, setCustomerId] = useState(routerCustomerId);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(-1);
  const [comment, setComment] = useState('');
  const [category, setCategory] = useState('service');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCust, setSelectedCust] = useState<any>(null);

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
    const found = customers.find((c: any) => c.id === customerId);
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

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!customerId) { setError('กรุณาเลือกบัญชีลูกค้าเพื่อบันทึกคำติชม'); return; }
    if (!comment.trim()) { setError('กรุณากรอกความคิดเห็นหรือรายละเอียดคำติชม'); return; }

    setIsSubmitting(true);
    try {
      await createFeedback({
        customer_id: customerId,
        rating,
        comment: comment.trim(),
        category,
      });
      showToast('success', 'บันทึกคำติชมเรียบร้อยแล้ว');
      setError('');

      // Navigate to customers page with preselected customer to show detail modal
      navigate(`${PATHS.CUSTOMERS}?id=${customerId}`);
    } catch (err: any) {
      showToast('error', `บันทึกไม่สำเร็จ: ${err?.message ?? 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    customerId,
    setCustomerId,
    rating,
    setRating,
    hoverRating,
    setHoverRating,
    comment,
    setComment,
    category,
    setCategory,
    error,
    setError,
    isSubmitting,
    handleSubmit,
    selectedCust,
  };
}

export default useAddFeedback;
