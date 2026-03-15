// src/utils/exportPDF.js
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export function exportApplicationsPDF(applications) {
  const doc = new jsPDF()

  // ── HEADER ──
  doc.setFillColor(37, 99, 235)
  doc.rect(0, 0, 220, 28, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('Co-op Application Tracker', 14, 12)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Generated on ${new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })}`, 14, 22)

  // ── SUMMARY STATS ──
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.text('Summary', 14, 40)

  const stats = [
    ['Total Applications', applications.length],
    ['Interviews',         applications.filter(a => a.status === 'Interview').length],
    ['Offers',             applications.filter(a => a.status === 'Offer Received').length],
    ['Rejected',           applications.filter(a => a.status === 'Rejected').length],
    ['Ghosted',            applications.filter(a => a.status === 'Ghosted').length],
    ['Active',             applications.filter(a => !['Rejected','Ghosted'].includes(a.status)).length],
  ]

  autoTable(doc, {
    startY:    45,
    head:      [['Metric', 'Count']],
    body:      stats,
    theme:     'striped',
    headStyles:    { fillColor: [37, 99, 235], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [239, 246, 255] },
    margin:    { left: 14, right: 14 },
    tableWidth: 80,
  })

  // ── ALL APPLICATIONS TABLE ──
  const tableY = doc.lastAutoTable.finalY + 14

  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.text('All Applications', 14, tableY)

  const rows = applications.map(app => [
    app.company,
    app.role,
    app.status,
    app.dateApplied || '—',
    app.deadline    || '—',
    app.interviewDate ? `${app.interviewDate}${app.interviewTime ? ' ' + app.interviewTime : ''}` : '—',
    app.recruiterName  || '—',
    app.resumeUsed     || '—',
  ])

  autoTable(doc, {
    startY:   tableY + 5,
    head:     [['Company', 'Role', 'Status', 'Applied', 'Deadline', 'Interview', 'Recruiter', 'Resume']],
    body:     rows,
    theme:    'striped',
    headStyles:    { fillColor: [37, 99, 235], textColor: 255, fontStyle: 'bold', fontSize: 8 },
    bodyStyles:    { fontSize: 7.5 },
    alternateRowStyles: { fillColor: [239, 246, 255] },
    margin:   { left: 14, right: 14 },
    columnStyles: {
      0: { cellWidth: 28 },
      1: { cellWidth: 40 },
      2: { cellWidth: 22 },
      3: { cellWidth: 18 },
      4: { cellWidth: 18 },
      5: { cellWidth: 22 },
      6: { cellWidth: 22 },
      7: { cellWidth: 22 },
    }
  })

  // ── NOTES PAGE — only apps with notes ──
  const appsWithNotes = applications.filter(a => a.notes)
  if (appsWithNotes.length > 0) {
    doc.addPage()

    doc.setFillColor(37, 99, 235)
    doc.rect(0, 0, 220, 18, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(13)
    doc.setFont('helvetica', 'bold')
    doc.text('Application Notes', 14, 12)

    doc.setTextColor(0, 0, 0)
    let y = 30

    appsWithNotes.forEach(app => {
      if (y > 260) {
        doc.addPage()
        y = 20
      }
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(37, 99, 235)
      doc.text(`${app.company} — ${app.role}`, 14, y)
      y += 6

      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(80, 80, 80)
      const lines = doc.splitTextToSize(app.notes, 180)
      doc.text(lines, 14, y)
      y += (lines.length * 5) + 8

      // Divider
      doc.setDrawColor(200, 200, 200)
      doc.line(14, y - 4, 196, y - 4)
    })
  }

  // ── FOOTER ON EACH PAGE ──
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.setFont('helvetica', 'normal')
    doc.text(
      `Co-op Application Tracker  •  Page ${i} of ${pageCount}  •  Algonquin College`,
      14,
      doc.internal.pageSize.height - 8
    )
  }

  // ── SAVE ──
  const fileName = `CoopApplications_${new Date().toISOString().split('T')[0]}.pdf`
  doc.save(fileName)
}