// ============================================================
//  TrackFlow – Bug Report Form  (FIXED VERSION)
//  All 6 bugs resolved: validation, loading, errors, reset, etc.
// ============================================================

import { useState } from 'react'
import { submitBugReport } from './api'
import { EMPTY_FORM } from './EMPTY_FORM.js'

const SEVERITIES = ['Critical', 'High', 'Medium', 'Low']
const COMPONENTS = ['Authentication', 'Dashboard', 'Billing', 'API', 'Notifications', 'Settings']

export default function App() {
  const [form, setForm] = useState({
    title: '',
    severity: '',
    component: '',
    description: '',
    steps: '',
    stepsCount: '',
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState(null)
  const [submitted, setSubmitted] = useState([])
  const [successId, setSuccessId] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    if (errors[name]) {
      setErrors(prev => {
        const newErrs = { ...prev }
        delete newErrs[name]
        return newErrs
      })
    }
  }

  const validate = (data) => {
    const errs = {}

    if (!data.title.trim()) errs.title = 'Bug title is required.'
    if (!data.severity) errs.severity = 'Please select a severity level.'
    if (!data.component) errs.component = 'Please select affected component.'
    if (!data.description.trim()) errs.description = 'Please describe the bug.'

    const stepsNum = parseInt(data.stepsCount)
    if (isNaN(stepsNum) || stepsNum < 1) {
      errs.stepsCount = 'Must be a positive whole number.'
    }

    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const errs = validate(form)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setLoading(true)
    setServerError(null)
    try {
      const result = await submitBugReport(form)
      setSuccessId(result.id)
      setSubmitted((prev) => [result, ...prev])
      setForm(EMPTY_FORM)
    } catch (err) {
      if (err.field) {
        setErrors(prev => ({ ...prev, [err.field]: err.message }))
      } else {
        setServerError(err.message || 'Submission failed.')
      }
    } finally {
      setLoading(false)
    }
  }

  const sevClass = (s) =>
    ({ Critical: 'sev-critical', High: 'sev-high', Medium: 'sev-medium', Low: 'sev-low' }[s] ?? '')

  const errorStyle = { borderColor: 'var(--danger, #f75f5f)', borderWidth: '2px' }

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <div className="badge">⬡ TrackFlow Internal Tools</div>
        <h1>Report a Bug</h1>
        <p>
          You're on the <strong>QA Engineering</strong> team at <strong>TrackFlow Inc.</strong> The
          team uses this form to log bugs before sprint planning every Monday. Help your teammates
          by making sure the form works correctly.
        </p>
      </header>

      <div className="card">
        <p className="section-label">New Bug Report</p>
        <form onSubmit={handleSubmit} noValidate>

          {successId && (
            <div style={{ background: 'rgba(76,175,125,0.1)', border: '1px solid rgba(76,175,125,0.3)', borderRadius: 8, padding: '12px 16px', marginBottom: 20, fontSize: 14, color: '#4caf7d' }}>
              ✓ Bug <strong>{successId}</strong> filed successfully!
            </div>
          )}

          {serverError && (
            <div style={{ background: 'rgba(247,95,95,0.1)', border: '1px solid rgba(247,95,95,0.3)', borderRadius: 8, padding: '12px 16px', marginBottom: 20, fontSize: 14, color: '#f75f5f' }}>
              {serverError}
            </div>
          )}

          <div className="form-group">
            <label>Bug Title <span className="req">*</span></label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Checkout button unresponsive on mobile Safari"
              style={errors.title ? errorStyle : {}}
            />
            {errors.title && (
              <span style={{ color: 'var(--danger, #f75f5f)', fontSize: 12, display: 'block', marginTop: 4 }}>
                ⚑ {errors.title}
              </span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Severity <span className="req">*</span></label>
              <select 
                name="severity" 
                value={form.severity} 
                onChange={handleChange}
                style={errors.severity ? errorStyle : {}}
              >
                <option value="">— Select —</option>
                {SEVERITIES.map((s) => <option key={s}>{s}</option>)}
              </select>
              {errors.severity && (
                <span style={{ color: 'var(--danger, #f75f5f)', fontSize: 12, display: 'block', marginTop: 4 }}>
                  ⚑ {errors.severity}
                </span>
              )}
            </div>
            <div className="form-group">
              <label>Affected Component <span className="req">*</span></label>
              <select 
                name="component" 
                value={form.component} 
                onChange={handleChange}
                style={errors.component ? errorStyle : {}}
              >
                <option value="">— Select —</option>
                {COMPONENTS.map((c) => <option key={c}>{c}</option>)}
              </select>
              {errors.component && (
                <span style={{ color: 'var(--danger, #f75f5f)', fontSize: 12, display: 'block', marginTop: 4 }}>
                  ⚑ {errors.component}
                </span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Description <span className="req">*</span></label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe what's happening and what the expected behaviour should be…"
              style={errors.description ? errorStyle : {}}
            />
            {errors.description && (
              <span style={{ color: 'var(--danger, #f75f5f)', fontSize: 12, display: 'block', marginTop: 4 }}>
                ⚑ {errors.description}
              </span>
            )}
          </div>

          <hr className="divider" />

          <div className="form-row">
            <div className="form-group">
              <label>Steps to Reproduce</label>
              <textarea
                name="steps"
                value={form.steps}
                onChange={handleChange}
                style={{ minHeight: 72 }}
                placeholder="1. Go to…&#10;2. Click…&#10;3. Observe…"
              />
            </div>
            <div className="form-group">
              <label>No. of Steps <span className="req">*</span></label>
              <input
                type="number"
                name="stepsCount"
                value={form.stepsCount}
                onChange={handleChange}
                placeholder="e.g. 3"
                style={errors.stepsCount ? errorStyle : {}}
              />
              {errors.stepsCount && (
                <span style={{ color: 'var(--danger, #f75f5f)', fontSize: 12, display: 'block', marginTop: 4 }}>
                  ⚑ {errors.stepsCount}
                </span>
              )}
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Submitting…' : 'Submit Bug Report'}
          </button>

        </form>
      </div>

      {submitted.length > 0 && (
        <div className="submitted-list">
          <p className="section-label" style={{ marginBottom: 8 }}>Filed This Session</p>
          {submitted.map((bug, i) => (
            <div key={i} className="submitted-item">
              <div>
                <div className="title">{bug.title}</div>
                <div className="meta">{bug.component} · {bug.stepsCount} steps</div>
              </div>
              <span className={`severity-badge ${sevClass(bug.severity)}`}>{bug.severity}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

