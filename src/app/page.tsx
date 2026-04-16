import { getUser } from "@/actions";
import { getProjects } from "@/actions/get-projects";
import { createProject } from "@/actions/create-project";
import { MainContent } from "./main-content";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getUser();

  // If user is authenticated, redirect to their most recent project
  if (user) {
    const projects = await getProjects();
    
    if (projects.length > 0) {
      redirect(`/${projects[0].id}`);
    }

    // If no projects exist, create a new one
    const newProject = await createProject({
      name: `New Design #${~~(Math.random() * 100000)}`,
      messages: [],
      data: {},
    });

    redirect(`/${newProject.id}`);
  }

  // For anonymous users, show the main content with the starter component
  const starterData: Record<string, any> = {
    "/": { type: "directory", name: "/", path: "/" },
    "/components": { type: "directory", name: "components", path: "/components" },
    "/App.jsx": {
      type: "file",
      name: "App.jsx",
      path: "/App.jsx",
      content: `import ResponseCard from '@/components/ResponseCard';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <ResponseCard />
    </div>
  );
}`,
    },
    "/components/ResponseCard.jsx": {
      type: "file",
      name: "ResponseCard.jsx",
      path: "/components/ResponseCard.jsx",
      content: `import { useState } from 'react';

function SunIcon() {
  return (
    <svg viewBox="0 0 80 80" width="80" height="80" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="18" fill="#FDE68A" stroke="#F59E0B" strokeWidth="2" />
      {[0,45,90,135,180,225,270,315].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 40 + 22 * Math.cos(rad);
        const y1 = 40 + 22 * Math.sin(rad);
        const x2 = 40 + 32 * Math.cos(rad);
        const y2 = 40 + 32 * Math.sin(rad);
        return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />;
      })}
    </svg>
  );
}

export default function ResponseCard() {
  const [selected, setSelected] = useState(null);
  const [otherText, setOtherText] = useState('');

  return (
    <div className="rounded-2xl shadow-xl w-full max-w-sm overflow-hidden" style={{background: 'linear-gradient(160deg, #FDE68A 0%, #FB923C 35%, #EC4899 70%, #7C3AED 100%)'}}>
      {/* Sun image area */}
      <div className="flex justify-center pt-8 pb-4">
        <SunIcon />
      </div>

      {/* Card body */}
      <div className="mx-4 mb-4 rounded-xl p-5" style={{background: 'rgba(255,255,255,0.20)', backdropFilter: 'blur(8px)'}}>
        <h2 className="text-lg font-bold text-white mb-1">Please respond</h2>
        <p className="text-sm text-orange-100 mb-4">Select the option that best applies.</p>

        <div className="space-y-3">
          {['Yes', 'No'].map((option) => (
            <label key={option} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="response"
                value={option.toLowerCase()}
                checked={selected === option.toLowerCase()}
                onChange={() => setSelected(option.toLowerCase())}
                className="w-4 h-4 accent-orange-300"
              />
              <span className="text-white text-sm font-medium">{option}</span>
            </label>
          ))}

          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="radio"
              name="response"
              value="other"
              checked={selected === 'other'}
              onChange={() => setSelected('other')}
              className="w-4 h-4 accent-orange-300"
            />
            <span className="text-white text-sm font-medium">Other</span>
          </label>

          {selected === 'other' && (
            <div className="ml-7">
              <input
                type="text"
                value={otherText}
                onChange={(e) => setOtherText(e.target.value)}
                placeholder="Please specify..."
                autoFocus
                className="w-full px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
                style={{background: 'rgba(255,255,255,0.25)', color: 'white'}}
              />
            </div>
          )}
        </div>

        {selected && (
          <div className="mt-4 pt-4" style={{borderTop: '1px solid rgba(255,255,255,0.3)'}}>
            <p className="text-sm text-orange-100">
              Selected:{' '}
              <span className="font-semibold text-white">
                {selected === 'other'
                  ? \`Other: \${otherText || '(blank)'}\`
                  : selected.charAt(0).toUpperCase() + selected.slice(1)}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}`,
    },
  };

  return <MainContent user={user} initialData={starterData} />;
}
