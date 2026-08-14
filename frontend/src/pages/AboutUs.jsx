import React from 'react';
import { Users, Mail, ShieldCheck, Heart, Car, Code2 } from 'lucide-react';
import utkarsh from '../assets/images/utkarsh.jpeg';
import jana from '../assets/images/jana.jpeg';
import jeeva from '../assets/images/jeeva.jpeg';
import bala from '../assets/images/bala.jpeg';
import pd from '../assets/images/pd.jpeg';

// Custom SVG Icons for Github and Linkedin
function Github(props) {
  const { size = 18, ...rest } = props;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...rest}>
      <path d="M12 .5C5.73.5.98 5.24.98 11.52c0 5.02 3.26 9.28 7.78 10.78.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.17.69-3.84-1.35-3.84-1.35-.52-1.31-1.27-1.66-1.27-1.66-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.25 3.33.95.1-.74.4-1.25.72-1.53-2.53-.29-5.19-1.27-5.19-5.63 0-1.24.44-2.26 1.17-3.05-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.14 1.17.91-.25 1.89-.38 2.86-.38.97 0 1.95.13 2.86.38 2.18-1.48 3.14-1.17 3.14-1.17.62 1.57.23 2.73.11 3.02.73.79 1.17 1.81 1.17 3.05 0 4.37-2.66 5.34-5.2 5.62.41.36.77 1.06.77 2.14 0 1.55-.01 2.79-.01 3.17 0 .3.2.66.79.55 4.51-1.51 7.77-5.76 7.77-10.78C23.02 5.24 18.27.5 12 .5z" />
    </svg>
  );
}

function Linkedin(props) {
  const { size = 18, ...rest } = props;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...rest}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.48v6.26zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45z" />
    </svg>
  );
}

export default function AboutUs() {
  const teamMembers = [
    {
      name: 'Utkarsh Chaturvedi',
      role: 'Full Stack Developer & UI/UX Designer & Team Lead',
      image: utkarsh,
      github: 'https://github.com/utkarshh911',
      linkedin: 'https://www.linkedin.com/in/utkarsh1791/',
      email: 'Utkarsh.chaturvedi2026@gmail.com',
      bio: 'Spearheading team workflows and architectural design. Passionate about building seamless user experiences with modern front-end frameworks and high-performance APIs.',
      skills: ['React.js', 'Tailwind CSS', 'UI/UX Design', 'System Architecture', 'Restfull Api'],
    },
    {
      name: 'Jeevanantham T',
      role: 'Backend & Database Engineer',
      image: jeeva,
      github: 'https://github.com/JEEVANANTHAM-T',
      linkedin: 'https://www.linkedin.com/in/jeevanantham-thambusamy-3a6a6b253',
      email: 'jeevananthamthambusamy@gmail.com',
      bio: 'Specializing in robust server-side logic, database query optimizations, and microservice integration to keep system transactions smooth and secure.',
      skills: ['Spring Boot', 'Express', 'SQL / NoSQL', 'Database Design', 'RESTful APIs'],
    },
    {
      name: 'Janarthanam T',
      role: 'Backend & Database Engineer',
      image: jana,
      github: 'https://github.com/Tjanarthanam',
      linkedin: 'https://www.linkedin.com/in/janarthanam-thambusamy-63642026a/',
      email: 'janarthanamthambusamy@gmail.com',
      bio: 'Focused on developing secure authentication routines, data validation pipelines, and scalable database schemas for production readiness.',
      skills: ['Backend Architecture', 'PostgreSQL / MongoDB', 'API Security', 'ORM Tools'],
    },
    {
      name: 'Balaji C',
      role: 'Backend & Database Engineer',
      image: bala,
      github: 'https://github.com/balajisengunthar',
      linkedin: null,
      email: 'balasekran@gmail.com',
      bio: 'Handling database optimization, caching layers, and backend integration tests to ensure reliable processing under heavy workloads.',
      skills: ['Database Optimization', 'SQL', 'Server Logic', 'REST APIs', 'Git Workflow'],
    },
    {
      name: 'Priyanshu Dwivedi',
      role: 'Frontend Developer & QA Engineer',
      image: pd,
      github: 'https://github.com/priyanshdwivedi18-maker',
      linkedin: 'https://www.linkedin.com/in/priyanshu-dwivedi-ba1640403/',
      email: 'priyanshdwivedi18@gmail.com',
      bio: 'Dedicated to frontend interface implementation, cross-browser compatibility, and quality assurance testing across complex application flows.',
      skills: ['React.js', 'Component Design', 'Quality Assurance', 'Unit Testing', 'Tailwind CSS'],
    },
  ];

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] pt-24 pb-20 px-6 sm:px-10 lg:px-16">
      <div className="max-w-6xl mx-auto space-y-20">
        
        {/* Top Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-black uppercase tracking-widest bg-blue-100 text-blue-800 px-4 py-1.5 rounded-full border border-blue-200">
            PGCP-AC Group 009
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight">
            Meet Our Engineering Team
          </h1>
          <p className="text-slate-600 font-medium text-base sm:text-lg">
            The minds behind the design, architecture, and core system development.
          </p>
        </div>

        {/* Team Members Detailed Horizontal Layout */}
        <div className="space-y-8">
          {teamMembers.map((member, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs hover:shadow-md transition duration-300 flex flex-col md:flex-row gap-8 items-center md:items-start"
            >
              {/* Left Side: Image Only */}
              <div className="flex-shrink-0">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl object-cover border-4 border-slate-100 shadow-md"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=0D8ABC&color=fff&size=200`;
                  }}
                />
              </div>

              {/* Right Side: Details, Social Links, Bio & Skills */}
              <div className="flex-1 space-y-4 text-center md:text-left w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-2xl font-black text-slate-950">{member.name}</h3>
                    <p className="text-sm font-bold text-blue-600 mt-0.5">{member.role}</p>
                  </div>

                  {/* Connecting URLs / Action Icons */}
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    {member.github && (
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 text-slate-500 hover:text-slate-950 hover:bg-slate-100 rounded-xl border border-slate-200/60 transition"
                        title="GitHub Profile"
                      >
                        <Github size={20} />
                      </a>
                    )}
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl border border-slate-200/60 transition"
                        title="LinkedIn Profile"
                      >
                        <Linkedin size={20} />
                      </a>
                    )}
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="p-2.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-slate-200/60 transition"
                        title="Send Email"
                      >
                        <Mail size={20} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Member Biography */}
                <p className="text-slate-600 text-sm leading-relaxed font-medium">
                  {member.bio}
                </p>

                {/* Tech Stack & Core Competencies */}
                <div className="pt-2">
                  <div className="flex items-center justify-center md:justify-start gap-1.5 text-xs font-bold text-slate-400 mb-2">
                    <Code2 size={15} />
                    <span>Key Expertise & Technologies</span>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    {member.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-xs font-semibold bg-slate-100 text-slate-700 px-3 py-1 rounded-lg border border-slate-200/70"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <hr className="border-slate-200" />

        {/* Project Mission Section */}
        <div className="space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-black uppercase tracking-widest bg-blue-100 text-blue-800 px-4 py-1.5 rounded-full border border-blue-200">
              About Our Project
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Connecting Commuters, Reducing Carbon Footprints.
            </h2>
            <p className="text-slate-600 font-medium text-base sm:text-lg leading-relaxed">
              We built this Smart Rideshare Platform to solve everyday commuting challenges. By enabling seamless carpooling between drivers and passengers, we aim to make travel safer, cheaper, and more sustainable.
            </p>
          </div>

          {/* Core Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 font-bold">
                <Car size={24} />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base">Smart Carpooling</h3>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">Real-time route matching for hassle-free rides.</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0 font-bold">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base">Safety First</h3>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">Verified driver profiles and secure payouts.</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center flex-shrink-0 font-bold">
                <Heart size={24} />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base">Eco-Friendly</h3>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">Reducing city traffic and individual emissions.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}