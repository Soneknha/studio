"use client"
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Fragment } from 'react'
import { ChevronRight } from 'lucide-react'

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const translations: { [key: string]: string } = {
  dashboard: 'Dashboard',
  announcements: 'Avisos',
  reservations: 'Reservas',
  incidents: 'Ocorrências',
  chat: 'Chat',
  documents: 'Documentos',
  residents: 'Moradores',
  settings: 'Configurações'
};

export function BreadcrumbNav() {
  const pathname = usePathname()
  const pathSegments = pathname.split('/').filter(Boolean)

  if (pathSegments.length === 0) {
    return <h1 className="text-xl font-semibold font-headline">Dashboard</h1>
  }

  const rootSegment = pathSegments[0];

  return (
    <nav aria-label="breadcrumb">
      <ol className="flex items-center gap-1.5 sm:gap-2">
        {pathSegments.map((segment, index) => {
          const href = `/${pathSegments.slice(0, index + 1).join('/')}`
          const isLast = index === pathSegments.length - 1
          const translatedSegment = translations[segment] || capitalize(segment);

          return (
            <Fragment key={href}>
              {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
              <li>
                {isLast ? (
                  <h1 className="text-lg font-semibold font-headline text-foreground" aria-current="page">
                    {translatedSegment}
                  </h1>
                ) : (
                  <Link href={href} className="text-lg font-semibold font-headline text-muted-foreground hover:text-foreground transition-colors">
                    {translatedSegment}
                  </Link>
                )}
              </li>
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
