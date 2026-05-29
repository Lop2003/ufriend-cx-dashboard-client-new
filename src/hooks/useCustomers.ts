import { useState, useEffect, useCallback } from "react";
import { fetchCustomers } from "../services/customerService";

/**
 * useCustomers — fetch รายการลูกค้าจาก API พร้อม server-side pagination
 * ใช้ระบบ Active flag เพื่อแก้ไขปัญหา Async Race Condition เสมอ
 */
export function useCustomers(options: any = {}) {
  const {
    search = "",
    branch = "",
    status = "",
    sortBy = "created_at",
    sortOrder = "desc",
    page = 1,
    limit = 10,
  } = options;

  const [customers, setCustomers] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(page);
  const [currentLimit, setCurrentLimit] = useState<number>(limit);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // loadCustomers สำหรับเรียกใช้แบบ manual refetch
  const loadCustomers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchCustomers({
        search,
        branch,
        status,
        sortBy,
        sortOrder,
        page: currentPage,
        limit: currentLimit,
      });
      setCustomers(data?.items || []);
      setTotal(data?.total ?? 0);
      setTotalPages(data?.total_pages ?? 1);
    } catch (err) {
      console.error("Failed to fetch customers:", err);
      setError("ไม่สามารถโหลดข้อมูลรายชื่อลูกค้าได้");
      setCustomers([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [search, branch, status, sortBy, sortOrder, currentPage, currentLimit]);

  // Reset กลับหน้าแรกเมื่อ filter/sort เปลี่ยน
  useEffect(() => {
    setCurrentPage(1);
  }, [search, branch, status, sortBy, sortOrder]);

  // Fetch หลักที่ใช้ Active Flag เพื่อแก้ปัญหา Async Race Condition
  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchCustomers({
          search,
          branch,
          status,
          sortBy,
          sortOrder,
          page: currentPage,
          limit: currentLimit,
        });
        if (active) {
          setCustomers(data?.items || []);
          setTotal(data?.total ?? 0);
          setTotalPages(data?.total_pages ?? 1);
        }
      } catch (err) {
        if (active) {
          console.error("Failed to fetch customers:", err);
          setError("ไม่สามารถโหลดข้อมูลรายชื่อลูกค้าได้");
          setCustomers([]);
          setTotal(0);
          setTotalPages(1);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      active = false;
    };
  }, [search, branch, status, sortBy, sortOrder, currentPage, currentLimit]);

  return {
    customers,
    total,
    totalPages,
    page: currentPage,
    limit: currentLimit,
    setPage: setCurrentPage,
    setLimit: setCurrentLimit,
    isLoading,
    error,
    refetch: loadCustomers,
  };
}

export default useCustomers;
