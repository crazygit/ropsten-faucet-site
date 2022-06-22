export default function BlankA({
  href,
  children,
  className
}: {
  href: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={className || ""}>
      {children}
    </a>
  )
}
