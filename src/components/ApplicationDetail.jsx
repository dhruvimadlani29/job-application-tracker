// src/components/ApplicationDetail.jsx
import DetailHeader from "./detail/DetailHeader";
import DetailBasicInfo from "./detail/DetailBasicInfo";
import DetailSchedule from "./detail/DetailSchedule";
import DetailContact from "./detail/DetailContact";
import DetailDocuments from "./detail/DetailDocuments";
import DetailNotes from "./detail/DetailNotes";
import DetailAIActions from "./detail/DetailAIActions";

function ApplicationDetail({ application, show, onClose, onEditOpen }) {
  if (!show || !application) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-[700px] mx-4 max-h-[90vh] flex flex-col">
        {/* Header — fixed, never scrolls */}
        <DetailHeader
          application={application}
          onClose={onClose}
          onEditOpen={onEditOpen}
        />

        {/* Body — scrolls independently */}
        <div className="overflow-y-auto flex-1 px-7 py-5 space-y-4">
          <DetailBasicInfo application={application} />
          <DetailSchedule application={application} />
          <DetailContact application={application} />
          <DetailDocuments application={application} />
          <DetailNotes notes={application.notes} />
          <DetailAIActions application={application} />
        </div>
      </div>
    </div>
  );
}

export default ApplicationDetail;
