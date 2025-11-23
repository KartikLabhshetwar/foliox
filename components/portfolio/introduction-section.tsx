import Image from 'next/image';
import Link from 'next/link';
import { FaGithub, FaEnvelope, FaLinkedin, FaXTwitter, FaGlobe } from 'react-icons/fa6';
import { FaMapMarkerAlt } from 'react-icons/fa';
import type { NormalizedProfile } from '@/types/github';
import SectionBorder from './section-border';
import { ShareButton } from './share-button';

interface IntroductionSectionProps {
  profile: NormalizedProfile;
}

export function IntroductionSection({ profile }: IntroductionSectionProps) {
  const socialLinks = [
    {
      icon: <FaGithub className="w-5 h-5" />,
      href: `https://github.com/${profile.username}`,
      label: 'GitHub',
    },
    ...(profile.email
      ? [
          {
            icon: <FaEnvelope className="w-5 h-5" />,
            href: `mailto:${profile.email}`,
            label: 'Email',
          },
        ]
      : []),
    ...(profile.linkedin_url
      ? [
          {
            icon: <FaLinkedin className="w-5 h-5" />,
            href: profile.linkedin_url,
            label: 'LinkedIn',
          },
        ]
      : []),
    ...(profile.twitter_username
      ? [
          {
            icon: <FaXTwitter className="w-5 h-5" />,
            href: `https://twitter.com/${profile.twitter_username}`,
            label: 'Twitter',
          },
        ]
      : []),
    ...(profile.website
      ? [
          {
            icon: <FaGlobe className="w-5 h-5" />,
            href: profile.website,
            label: 'Website',
          },
        ]
      : []),
  ];

  return (
    <div className="relative w-full py-8 sm:py-12 md:py-16">
      <SectionBorder className="absolute bottom-0 left-0 right-0" />
      <div className="flex items-center justify-between mb-6">
        <Link href="/" className="hover:opacity-80 transition-opacity">
        <span className="text-xl text-foreground font-bold">
              <span className="font-[var(--font-playfair)] italic font-normal">folio</span>
              <span className="font-sans">x</span>
        </span>
        </Link>
        <ShareButton username={profile.username} />
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex-1 order-2 sm:order-1">
          <h1 className="font-bold text-3xl md:text-5xl tracking-tight mb-2 text-foreground">
            {profile.name || profile.username}
          </h1>
          <p className="text-muted-foreground text-sm mb-3">
            @{profile.username}
          </p>
          {profile.bio && (
            <p className="text-muted-foreground text-base sm:text-lg mb-4">
              {profile.bio}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-muted-foreground mb-4">
            {profile.location && (
              <div className="flex items-center gap-1.5">
                <FaMapMarkerAlt className="h-4 w-4 flex-shrink-0" />
                <span>{profile.location}</span>
              </div>
            )}
            {profile.public_repos > 0 && (
              <span>{profile.public_repos} repos</span>
            )}
            {profile.followers > 0 && (
              <span>{profile.followers} followers</span>
            )}
            {profile.following > 0 && (
              <span>{profile.following} following</span>
            )}
          </div>
          {socialLinks.length > 0 && (
            <div className="flex items-center gap-4">
              {socialLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  aria-label={link.label}
                >
                  {link.icon}
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className="flex-shrink-0 order-1 sm:order-2">
          <Image
            src={profile.avatar_url}
            alt={`${profile.name || profile.username}'s Photo`}
            height={200}
            width={200}
            className="object-cover rounded-full border-4 border-border"
          />
        </div>
      </div>
    </div>
  );
}

