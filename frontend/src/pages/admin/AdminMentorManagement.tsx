


import React, { useState, useEffect } from 'react';
import { getUsers, approveTeacher, rejectTeacher, blockUser, unblockUser } from '../../services/adminServices';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import '../../styles/AdminMentorManagement.css';
import { User, UserRole, TeacherRequestStatus } from '../../interfaces/userInterface';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.0.0/pdf.worker.min.js`;

const AdminMentorManagement: React.FC = () => {
  const [mentors, setMentors] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedMentorForReject, setSelectedMentorForReject] = useState<User | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedMentorDetails, setSelectedMentorDetails] = useState<User | null>(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [selectedCertificateUrl, setSelectedCertificateUrl] = useState<string | null>(null);
  const [pdfLoadError, setPdfLoadError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const allUsers = await getUsers(UserRole.Teacher);
        const submittedMentors = allUsers.filter(
          (user) =>
            user.teacherRequestStatus !== TeacherRequestStatus.NotRequested &&
            user.teacherRequestStatus !== undefined
        );
        setMentors(submittedMentors);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch mentors');
      }
    };
    fetchMentors();
  }, []);

  const handleApproveTeacher = async (userId: string) => {
    try {
      await approveTeacher(userId);
      setMentors(
        mentors.map((mentor) =>
          mentor._id === userId ? { ...mentor, teacherRequestStatus: TeacherRequestStatus.Approved } : mentor
        )
      );
      if (selectedMentorDetails && selectedMentorDetails._id === userId) {
        setShowDetailsModal(false);
        setSelectedMentorDetails(null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to approve mentor');
    }
  };

  const openRejectModal = (mentor: User) => {
    setSelectedMentorForReject(mentor);
    setShowRejectModal(true);
  };

  const handleRejectTeacher = async () => {
    if (!selectedMentorForReject) return;
    try {
      await rejectTeacher(selectedMentorForReject._id, rejectionReason);
      setMentors(
        mentors.map((mentor) =>
          mentor._id === selectedMentorForReject._id
            ? {
                ...mentor,
                teacherRequestStatus: TeacherRequestStatus.Rejected,
                teacherRequestRejectionReason: rejectionReason,
              }
            : mentor
        )
      );
      setShowRejectModal(false);
      setRejectionReason('');
      setSelectedMentorForReject(null);
      if (selectedMentorDetails && selectedMentorDetails._id === selectedMentorForReject._id) {
        setShowDetailsModal(false);
        setSelectedMentorDetails(null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to reject mentor');
    }
  };

  const handleBlockMentor = async (mentorId: string, isBlocked: boolean) => {
    try {
      if (isBlocked) {
        await unblockUser(mentorId);
      } else {
        await blockUser(mentorId);
      }
      setMentors(
        mentors.map((mentor) =>
          mentor._id === mentorId ? { ...mentor, isBlocked: !isBlocked } : mentor
        )
      );
    } catch (err: any) {
      setError(err.message || 'Failed to update mentor block status');
    }
  };

  const getStatusDisplay = (status: TeacherRequestStatus) => {
    switch (status) {
      case TeacherRequestStatus.Pending:
        return <span className="status-pending">Pending</span>;
      case TeacherRequestStatus.Approved:
        return <span className="status-approved">Approved</span>;
      case TeacherRequestStatus.Rejected:
        return <span className="status-rejected">Rejected</span>;
      default:
        return <span className="status-not-requested">Not Requested</span>;
    }
  };

  const openDetailsModal = (mentor: User) => {
    setSelectedMentorDetails(mentor);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedMentorDetails(null);
  };

  const openCertificateModal = (certUrl: string) => {
    console.log('[AdminMentorManagement] Opening certificate modal for:', certUrl);
    setSelectedCertificateUrl(certUrl);
    setShowCertificateModal(true);
    setPdfLoadError(null);
  };

  const closeCertificateModal = () => {
    setShowCertificateModal(false);
    setSelectedCertificateUrl(null);
    setPdfLoadError(null);
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-mentor-management">
        <h2>Mentor Requests</h2>
        {error && <div className="error">{error}</div>}
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
              <th>Block/Unblock</th>
              <th>View Details</th>
            </tr>
          </thead>
          <tbody>
            {mentors.map((mentor) => (
              <tr key={mentor._id}>
                <td>{mentor.name}</td>
                <td>{mentor.email}</td>
                <td>
                  {getStatusDisplay(mentor.teacherRequestStatus || TeacherRequestStatus.NotRequested)}
                  {mentor.teacherRequestStatus === TeacherRequestStatus.Rejected &&
                    mentor.teacherRequestRejectionReason && (
                      <div className="rejection-reason">
                        Reason: {mentor.teacherRequestRejectionReason}
                      </div>
                    )}
                </td>
                <td>
                  {mentor.teacherRequestStatus === TeacherRequestStatus.Pending && (
                    <>
                      <button onClick={() => handleApproveTeacher(mentor._id)}>Approve</button>
                      <button onClick={() => openRejectModal(mentor)}>Reject</button>
                    </>
                  )}
                  {mentor.teacherRequestStatus === TeacherRequestStatus.Approved && (
                    <button disabled>Approved</button>
                  )}
                  {mentor.teacherRequestStatus === TeacherRequestStatus.Rejected && (
                    <button disabled>Rejected</button>
                  )}
                </td>
                <td>
                  <button onClick={() => handleBlockMentor(mentor._id, mentor.isBlocked)}>
                    {mentor.isBlocked ? 'Unblock' : 'Block'}
                  </button>
                </td>
                <td>
                  <button onClick={() => openDetailsModal(mentor)}>View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

  
        {showRejectModal && selectedMentorForReject && (
          <div className="modal">
            <div className="modal-content">
              <h3>Reject Mentor: {selectedMentorForReject.name}</h3>
              <textarea
                placeholder="Enter rejection reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
              <div className="modal-actions">
                <button onClick={handleRejectTeacher}>Submit</button>
                <button onClick={() => setShowRejectModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {showDetailsModal && selectedMentorDetails && (
          <div className="modal">
            <div className="modal-content">
              <h3>Mentor Details: {selectedMentorDetails.name}</h3>
              <p><strong>Email:</strong> {selectedMentorDetails.email}</p>
              <p><strong>Phone:</strong> {selectedMentorDetails.profile?.phone || 'N/A'}</p>
              <p><strong>Qualifications:</strong> {selectedMentorDetails.qualifications?.join(', ') || 'N/A'}</p>
              <p><strong>Experience:</strong> {selectedMentorDetails.experience || 'N/A'}</p>
              <h4>Certificates:</h4>
              {selectedMentorDetails.certificates && selectedMentorDetails.certificates.length > 0 ? (
                <div className="certificate-list">
                  {selectedMentorDetails.certificates.map((certUrl, index) => {
                    const fileExtension = certUrl.split('.').pop()?.toLowerCase();
                    const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension || '');

                    return (
                      <div key={index} className="certificate-item">
                        <button
                          onClick={() => openCertificateModal(certUrl)}
                          className="certificate-link"
                        >
                          Certificate {index + 1} ({fileExtension?.toUpperCase()})
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p>No certificates uploaded.</p>
              )}
              <div className="modal-actions">
                {selectedMentorDetails.teacherRequestStatus === TeacherRequestStatus.Pending && (
                  <>
                    <button onClick={() => handleApproveTeacher(selectedMentorDetails._id!)}>Approve</button>
                    <button
                      onClick={() => {
                        setSelectedMentorForReject(selectedMentorDetails);
                        setShowRejectModal(true);
                        setShowDetailsModal(false);
                      }}
                    >
                      Reject
                    </button>
                  </>
                )}
                <button onClick={closeDetailsModal}>Close</button>
              </div>
            </div>
          </div>
        )}

 
        {showCertificateModal && selectedCertificateUrl && (
          <div className="modal">
            <div className="modal-content certificate-modal">
              <h3>Certificate Preview</h3>
              {pdfLoadError && <div className="error">{pdfLoadError}</div>}
              {(() => {
                const fileExtension = selectedCertificateUrl.split('.').pop()?.toLowerCase();
                const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension || '');

                return isImage ? (
                  <img
                    src={selectedCertificateUrl}
                    alt="Certificate Preview"
                    className="certificate-image"
                    onError={(e) => {
                      console.error('[AdminMentorManagement] Certificate image load error:', selectedCertificateUrl);
                      (e.target as HTMLImageElement).style.display = 'none';
                      const link = document.createElement('a');
                      link.href = selectedCertificateUrl;
                      link.target = '_blank';
                      link.rel = 'noopener noreferrer';
                      link.textContent = 'Image failed to load, click to view';
                      (e.target as HTMLImageElement).parentNode?.appendChild(link);
                    }}
                  />
                ) : (
                  <div>
                    <Document
                      file={selectedCertificateUrl}
                      onLoadError={(error) => {
                        console.error('[AdminMentorManagement] PDF load error:', error.message);
                        setPdfLoadError('Failed to load PDF. Please download to view.');
                      }}
                      onLoadSuccess={() => console.log('[AdminMentorManagement] PDF loaded successfully:', selectedCertificateUrl)}
                    >
                      <Page pageNumber={1} width={500} />
                    </Document>
                    <a
                      href={selectedCertificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="download-link"
                    >
                      Download Certificate ({fileExtension?.toUpperCase()})
                    </a>
                  </div>
                );
              })()}
              <div className="modal-actions">
                <button onClick={closeCertificateModal}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMentorManagement;