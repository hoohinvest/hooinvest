'use client';

import { teamMembers } from '@/data/team';
import Image from 'next/image';

export default function TeamGrid() {
  return (
    <section className="py-14 border-t border-[#1A222C]">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-sm uppercase tracking-wide text-[#A9B4C0] mb-3">Leadership & Team</h2>
          <h3 className="text-2xl md:text-3xl font-semibold text-[#E8EEF5] mb-4">
            Meet the People Behind HooInvest
          </h3>
          <p className="text-[#A9B4C0] max-w-2xl mx-auto">
            Our team brings decades of combined experience in fintech, compliance, engineering, and operations.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="bg-[#11161D] border border-[#1A222C] rounded-2xl p-6 hover:border-[#00E18D] transition-all"
            >
              {/* Headshot */}
              <div className="mb-4">
                {member.headshotUrl ? (
                  <div className="w-24 h-24 rounded-full bg-[#1A222C] border-2 border-[#00E18D] overflow-hidden mx-auto">
                    <Image
                      src={member.headshotUrl}
                      alt={`${member.name} headshot`}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-[#1A222C] border-2 border-[#00E18D] mx-auto flex items-center justify-center">
                    <span className="text-3xl text-[#00E18D] font-bold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                )}
              </div>

              {/* Name & Role */}
              <div className="text-center mb-3">
                <h4 className="text-lg font-semibold text-[#E8EEF5] mb-1">{member.name}</h4>
                <p className="text-[#00E18D] text-sm font-medium">{member.role}</p>
                {member.location && (
                  <p className="text-[#A9B4C0] text-xs mt-1">{member.location}</p>
                )}
              </div>

              {/* Bio */}
              <p className="text-[#A9B4C0] text-sm leading-relaxed mb-4 text-center">
                {member.bioShort}
              </p>

              {/* Focus Tags */}
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                {member.focus.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="bg-[#1A222C] text-[#A9B4C0] text-xs px-2 py-1 rounded-full border border-[#1A222C]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="flex justify-center gap-3 pt-3 border-t border-[#1A222C]">
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#A9B4C0] hover:text-[#00E18D] transition-colors"
                    aria-label={`${member.name} on LinkedIn`}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                )}
                {member.emailPublic && (
                  <a
                    href={`mailto:${member.emailPublic}`}
                    className="text-[#A9B4C0] hover:text-[#00E18D] transition-colors"
                    aria-label={`Email ${member.name}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


