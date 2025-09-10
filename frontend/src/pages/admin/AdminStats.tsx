// frontend/src/pages/admin/AdminStats.tsx
import React, { useState, useEffect } from 'react';
import { getEnrollmentStats } from '../../services/enrollmentServices';
import '../../styles/Dashboard.css';

interface EnrollmentStats {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
}

const AdminStats: React.FC = () => {
    const [stats, setStats] = useState<EnrollmentStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const statsData = await getEnrollmentStats();
                setStats(statsData);
            } catch (err: any) {
                setError(err.message || 'Failed to load stats.');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="admin-stats">
            <h2>Enrollment Statistics</h2>
            {stats && (
                <div className="stats-container">
                    <p>Total Enrollments: {stats.total}</p>
                    <p>Pending Approvals: {stats.pending}</p>
                    <p>Approved Enrollments: {stats.approved}</p>
                    <p>Rejected Enrollments: {stats.rejected}</p>
                </div>
            )}
        </div>
    );
};

export default AdminStats;