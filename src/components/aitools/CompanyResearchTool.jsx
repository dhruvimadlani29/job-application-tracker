// src/components/aitools/CompanyResearchTool.jsx
import { useState } from "react";
import ResultBox from "./ResultBox";
import { callAI } from "./callAI";

function CompanyResearchTool() {
  const [form, setForm] = useState({ company: "", role: "" });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function research() {
    if (!form.company) {
      alert("Please enter a company name!");
      return;
    }
    setLoading(true);
    setResult("");
    try {
      const res = await callAI(
        `
        Research this company and role for a co-op student preparing to apply or interview.
        Company: ${form.company}
        Role: ${form.role || "Software Developer Co-op"}
        
        Provide a structured research brief with these exact sections:
        
        🏢 COMPANY OVERVIEW
        - What they do (1-2 sentences)
        - Company size and type
        - Known for / reputation
        
        💼 ROLE EXPECTATIONS
        - Typical responsibilities for this role
        - Skills they likely look for
        - Day-to-day work
        
        🎯 INTERVIEW TIPS
        - 2-3 things to research before the interview
        - 1-2 likely interview topics for this company/role
        
        💰 CO-OP INSIGHTS
        - Typical co-op experience at this type of company
        - What makes a strong candidate
        
        Keep each section brief and practical. Total under 300 words.
      `,
        600,
      );
      setResult(res);
    } catch (e) {
      setResult(`Error: ${e.message}`);
    }
    setLoading(false);
  }

  function copy() {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
            Company *
          </label>
          <input
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            placeholder="e.g. Shopify, TD Bank, Klarna"
            className="mt-1 w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5
  text-sm outline-none focus:border-blue-400 transition-colors
  bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100
  placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
            Role
          </label>
          <input
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            placeholder="e.g. Frontend Developer Co-op"
            className="mt-1 w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5
  text-sm outline-none focus:border-blue-400 transition-colors
  bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100
  placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
        </div>
      </div>

      <button
        onClick={research}
        disabled={loading}
        className="mt-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
      >
        {loading ? "Researching..." : "🔍 Research Company & Role"}
      </button>

      <ResultBox
        result={result}
        loading={loading}
        loadingText="Researching company and role..."
        onCopy={copy}
        copied={copied}
      />
    </div>
  );
}

export default CompanyResearchTool;
