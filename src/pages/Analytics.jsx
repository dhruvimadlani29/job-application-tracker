// src/pages/Analytics.jsx
import { useState, useEffect } from 'react'
import { getCurrentUser } from 'aws-amplify/auth'
import { getUserData } from '../utils/storage'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from 'recharts'

function Analytics() {

  const [applications, setApplications] = useState([])

  useEffect(() => {
    getCurrentUser()
      .then(u => {
        const data = getUserData('coopApplications', u.userId, [])
        setApplications(data)
      })
      .catch(() => setApplications([]))
  }, [])

  const total      = applications.length
  const interviews = applications.filter(a => a.status === 'Interview').length
  const offers     = applications.filter(a => a.status === 'Offer Received').length
  const rejected   = applications.filter(a => a.status === 'Rejected').length
  const ghosted    = applications.filter(a => a.status === 'Ghosted').length
  const active     = applications.filter(a => !['Rejected', 'Ghosted'].includes(a.status)).length

  const statusData = [
    { name: 'Applied',      count: applications.filter(a => a.status === 'Applied').length,           fill: '#3B82F6' },
    { name: 'Under Review', count: applications.filter(a => a.status === 'Under Review').length,      fill: '#0EA5E9' },
    { name: 'Phone Screen', count: applications.filter(a => a.status === 'Phone Screen').length,      fill: '#8B5CF6' },
    { name: 'Tech Test',    count: applications.filter(a => a.status === 'Technical Test').length,    fill: '#F59E0B' },
    { name: 'Interview',    count: interviews,                                                         fill: '#F97316' },
    { name: 'Awaiting',     count: applications.filter(a => a.status === 'Awaiting Decision').length, fill: '#6366F1' },
    { name: 'Offer',        count: offers,                                                             fill: '#22C55E' },
    { name: 'Rejected',     count: rejected,                                                           fill: '#EF4444' },
    { name: 'Ghosted',      count: ghosted,                                                            fill: '#9CA3AF' },
  ].filter(d => d.count > 0)

  const pieData = [
    { name: 'Active',   value: active,   color: '#3B82F6' },
    { name: 'Rejected', value: rejected, color: '#EF4444' },
    { name: 'Ghosted',  value: ghosted,  color: '#9CA3AF' },
    { name: 'Offers',   value: offers,   color: '#22C55E' },
  ].filter(d => d.value > 0)

  const timelineData = (() => {
    const monthMap = {}
    applications.forEach(app => {
      const date = new Date(app.dateApplied)
      if (isNaN(date.getTime())) return
      const key = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
      monthMap[key] = (monthMap[key] || 0) + 1
    })
    return Object.entries(monthMap)
      .map(([month, count]) => ({ month, count }))
      .slice(-6)
  })()

  const funnelSteps = [
    { step: 1, label: 'Applied',      count: total,      rate: 100 },
    { step: 2, label: 'Phone Screen', count: applications.filter(a => a.status === 'Phone Screen').length,
      rate: total > 0 ? Math.round((applications.filter(a => a.status === 'Phone Screen').length / total) * 100) : 0 },
    { step: 3, label: 'Interview',    count: interviews,
      rate: total > 0 ? Math.round((interviews / total) * 100) : 0 },
    { step: 4, label: 'Offer',        count: offers,
      rate: total > 0 ? Math.round((offers / total) * 100) : 0 },
  ]

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <div className="text-6xl mb-4">📊</div>
        <p className="text-lg font-semibold text-gray-500">No data yet</p>
        <p className="text-sm mt-1">Add applications from the Dashboard to see your analytics</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Applications', value: total,      color: 'text-blue-600',   bg: 'bg-blue-50'   },
          { label: 'Active Applications', value: active,    color: 'text-green-600',  bg: 'bg-green-50'  },
          { label: 'Interview Rate',
            value: `${total > 0 ? Math.round((interviews/total)*100) : 0}%`,
            color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Offer Rate',
            value: `${total > 0 ? Math.round((offers/total)*100) : 0}%`,
            color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Rejection Rate',
            value: `${total > 0 ? Math.round((rejected/total)*100) : 0}%`,
            color: 'text-red-500', bg: 'bg-red-50' },
          { label: 'Ghosted', value: ghosted, color: 'text-gray-500', bg: 'bg-gray-50' },
        ].map(stat => (
          <div key={stat.label} className={`${stat.bg} rounded-2xl p-5 border border-gray-100 shadow-sm`}>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{stat.label}</p>
            <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-2 gap-4">

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-bold text-gray-700 mb-1">Applications by Status</h3>
          <p className="text-xs text-gray-400 mb-4">How many applications in each stage</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={statusData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6"/>
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9CA3AF' }}/>
              <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} allowDecimals={false}/>
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', fontSize: '12px' }}/>
              <Bar dataKey="count" radius={[6,6,0,0]}>
                {statusData.map((entry, i) => <Cell key={i} fill={entry.fill}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-bold text-gray-700 mb-1">Application Breakdown</h3>
          <p className="text-xs text-gray-400 mb-4">Active vs rejected vs ghosted vs offers</p>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="60%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color}/>)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', fontSize: '12px' }}/>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2">
              {pieData.map(item => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}/>
                  <span className="text-xs text-gray-600">{item.name}</span>
                  <span className="text-xs font-bold text-gray-800 ml-auto pl-4">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-2 gap-4">

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-bold text-gray-700 mb-1">Applications Over Time</h3>
          <p className="text-xs text-gray-400 mb-4">How many you applied each month</p>
          {timelineData.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">
              No date data — make sure you set dates when adding applications
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={timelineData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6"/>
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9CA3AF' }}/>
                <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} allowDecimals={false}/>
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', fontSize: '12px' }}/>
                <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }}/>
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-bold text-gray-700 mb-1">Conversion Funnel</h3>
          <p className="text-xs text-gray-400 mb-5">How many applications convert at each stage</p>
          <div className="space-y-3">
            {funnelSteps.map((step, index) => {
              const barColors = ['#3B82F6', '#8B5CF6', '#F97316', '#22C55E']
              return (
                <div key={step.label}>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: barColors[index] }}>
                        {step.step}
                      </div>
                      <span className="text-sm font-medium text-gray-600">{step.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-800">{step.count}</span>
                      <span className="text-xs text-gray-400">({step.rate}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 ml-7">
                    <div className="h-2.5 rounded-full transition-all"
                      style={{ width: `${step.rate}%`, backgroundColor: barColors[index] }}/>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-5 bg-blue-50 rounded-xl p-4">
            <p className="text-xs font-bold text-blue-600 mb-1">💡 Your Insight</p>
            <p className="text-xs text-blue-700 leading-relaxed">
              {offers > 0
                ? `🎉 You converted ${offers} application${offers>1?'s':''} to offers — ${Math.round((offers/total)*100)}% offer rate!`
                : interviews > 0
                ? `You're getting interviews (${Math.round((interviews/total)*100)}% rate) — focus on converting them to offers!`
                : total >= 5
                ? `You've applied to ${total} jobs. Keep pushing — interviews usually start after 10-15 applications.`
                : `Keep applying! Most students need 20-40 applications before landing a co-op offer.`}
            </p>
          </div>
        </div>

      </div>

    </div>
  )
}

export default Analytics