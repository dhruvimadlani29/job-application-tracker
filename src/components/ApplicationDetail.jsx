// src/components/ApplicationDetail.jsx
import DetailHeader     from './detail/DetailHeader'
import DetailBasicInfo  from './detail/DetailBasicInfo'
import DetailSchedule   from './detail/DetailSchedule'
import DetailContact    from './detail/DetailContact'
import DetailDocuments  from './detail/DetailDocuments'
import DetailNotes      from './detail/DetailNotes'
import DetailAIActions  from './detail/DetailAIActions'

function ApplicationDetail({ application, show, onClose, onEditOpen }) {
  if (!show || !application) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl
        w-full max-w-[700px] max-h-[90vh] flex flex-col
        max-sm:fixed max-sm:bottom-0 max-sm:left-0 max-sm:right-0
        max-sm:rounded-b-none max-sm:max-h-[95vh]">

        {/* Header — sticky, never scrolls */}
        <DetailHeader
          application={application}
          onClose={onClose}
          onEditOpen={onEditOpen}
        />

        {/* Body — scrolls independently */}
        <div className="overflow-y-auto flex-1 px-7 py-5 space-y-4 max-sm:px-4">
          <DetailBasicInfo  application={application} />
          <DetailSchedule   application={application} />
          <DetailContact    application={application} />
          <DetailDocuments  application={application} />
          <DetailNotes      notes={application.notes}  />
          <DetailAIActions  application={application} />
        </div>

      </div>
    </div>
  )
}

export default ApplicationDetail
