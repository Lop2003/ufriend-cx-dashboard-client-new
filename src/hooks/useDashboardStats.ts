import { useState, useEffect, useCallback, useMemo } from "react";
import { fetchSummary, fetchBranchStats } from "../services/statsService";
import { fetchFeedbackStats } from "../services/feedbackService";
import type { SummaryStats, BranchStat, FeedbackStats } from "../types";

/**
 * useDashboardStats — fetch summary + branch stats + feedback stats สำหรับ dashboard
 */
export function useDashboardStats(options: { branch?: string; period?: string } = {}) {
  const { branch = "", period = "" } = options;

  const [apiSummary, setApiSummary] = useState<SummaryStats | null>(null);
  const [branchStats, setBranchStats] = useState<BranchStat[]>([]);
  const [apiFeedbackStats, setApiFeedbackStats] = useState<FeedbackStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [summaryResult, branchResult, feedbackStatsResult] =
        await Promise.allSettled([
          fetchSummary(period),
          fetchBranchStats("", period),
          fetchFeedbackStats(branch, period),
        ]);

      if (summaryResult.status === "fulfilled") {
        setApiSummary(summaryResult.value);
      } else {
        console.error("fetchSummary failed:", summaryResult.reason);
      }

      if (branchResult.status === "fulfilled") {
        setBranchStats(branchResult.value || []);
      } else {
        console.error("fetchBranchStats failed:", branchResult.reason);
      }

      if (feedbackStatsResult.status === "fulfilled") {
        setApiFeedbackStats(feedbackStatsResult.value);
      } else {
        console.error("fetchFeedbackStats failed:", feedbackStatsResult.reason);
      }

      if (
        summaryResult.status === "rejected" &&
        branchResult.status === "rejected"
      ) {
        setError("ไม่สามารถโหลดข้อมูลสถิติแดชบอร์ดได้");
      }
    } catch (err) {
      console.error("Unexpected error in loadData:", err);
      setError("ไม่สามารถโหลดข้อมูลสถิติแดชบอร์ดได้");
    } finally {
      setIsLoading(false);
    }
  }, [branch, period]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Compute summary stats dynamically สำหรับ branch ที่เลือก หรือ overall
  const summaryStats = useMemo(() => {
    let stats = {
      totalCustomers: 0,
      avgRating: "0.0",
      overdueCount: 0,
      satisfactionRate: "0",
      positiveCount: 0,
      neutralCount: 0,
      negativeCount: 0,
      weeklyCSAT: [4.0, 4.0, 4.0, 4.0],
    };

    if (branch && branchStats.length > 0) {
      const bStat = branchStats.find((s) => s.branch === branch);
      if (bStat) {
        stats.totalCustomers = bStat.customer_count;
        stats.avgRating = bStat.avg_rating.toFixed(1);
        stats.overdueCount = bStat.overdue_count;
      }
    } else if (apiSummary) {
      stats.totalCustomers = apiSummary.total_customers;
      stats.avgRating = apiSummary.avg_rating.toFixed(1);
      stats.overdueCount = apiSummary.overdue_count;
    }

    if (apiFeedbackStats) {
      const totalFeedbacks = apiFeedbackStats.positive_count + apiFeedbackStats.neutral_count + apiFeedbackStats.negative_count;
      stats.satisfactionRate = totalFeedbacks > 0 
        ? ((apiFeedbackStats.positive_count / totalFeedbacks) * 100).toFixed(0)
        : "0";
      stats.positiveCount = apiFeedbackStats.positive_count;
      stats.neutralCount = apiFeedbackStats.neutral_count;
      stats.negativeCount = apiFeedbackStats.negative_count;
      stats.weeklyCSAT = apiFeedbackStats.weekly_csat || [4.0, 4.0, 4.0, 4.0];
      // ใช้ average rating จริงๆ ของ feedbacks สำหรับความพึงพอใจ
      stats.avgRating = apiFeedbackStats.avg_rating.toFixed(1);
    }

    return stats;
  }, [apiSummary, apiFeedbackStats, branch, branchStats]);

  // Compute branch list จาก branchStats
  const branches = useMemo(() => {
    if (!branchStats || branchStats.length === 0) return [];
    const list = [...new Set(branchStats.map(s => s.branch).filter(Boolean))];
    return list.sort();
  }, [branchStats]);

  return {
    summaryStats,
    branchStats,
    branches,
    isLoading,
    error,
    refetch: loadData,
  };
}
