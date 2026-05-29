import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchBranchStats } from '../services/statsService';

const BRANCH_FALLBACK = [
  'วงเวียนใหญ่',
  'รังสิต',
  'ลาดพร้าว',
  'สยาม',
  'เชียงใหม่ นิมาน',
  'ขอนแก่น มข.',
  'หาดใหญ่ เซ็นทรัล',
  'ชลบุรี อมตะ',
];

/**
 * useBranches — fetch branch stats และ compute รายชื่อสาขาทั้งหมด
 * ใช้ได้กับทุก page ที่ต้องการ branch list (customers, dashboard, forms)
 */
export function useBranches() {
  const [branchStats, setBranchStats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadBranchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const stats = await fetchBranchStats();
      setBranchStats(stats || []);
    } catch (err) {
      console.error('Failed to fetch branch stats:', err);
      setError('ไม่สามารถโหลดข้อมูลสาขาได้');
      setBranchStats([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBranchStats();
  }, [loadBranchStats]);

  // Compute unique branch list — fallback ถ้า API ไม่มีข้อมูล
  const branches = useMemo(() => {
    if (!branchStats || branchStats.length === 0) return BRANCH_FALLBACK;
    const list = [...new Set(branchStats.map(s => s.branch).filter(Boolean))];
    return list.length > 0 ? list.sort() : BRANCH_FALLBACK;
  }, [branchStats]);

  return {
    branches,
    branchStats,
    isLoading,
    error,
    refetch: loadBranchStats,
  };
}

export default useBranches;
