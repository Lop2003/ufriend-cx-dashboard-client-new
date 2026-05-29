import { useState, useEffect, useCallback } from 'react';
import { fetchFeedbacks } from '../services/feedbackService';

/**
 * useFeedbacks — fetch feedbacks จาก API พร้อม filter ตาม branch (server-side)
 * @param {Object} options
 * @param {string} [options.branch] - กรอง feedback ตามสาขา (ส่งไป backend)
 */
export function useFeedbacks(options: { branch?: string } = {}) {
  const { branch = '' } = options;

  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadFeedbacks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchFeedbacks({ branch });
      setFeedbacks(data || []);
    } catch (err) {
      console.error('Failed to fetch feedbacks:', err);
      setError('ไม่สามารถโหลดข้อมูลคำติชมได้');
      setFeedbacks([]);
    } finally {
      setIsLoading(false);
    }
  }, [branch]);

  useEffect(() => {
    loadFeedbacks();
  }, [loadFeedbacks]);

  return {
    feedbacks,
    isLoading,
    error,
    refetch: loadFeedbacks,
  };
}

export default useFeedbacks;
