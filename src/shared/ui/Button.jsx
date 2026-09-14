import './Button.css'

// Outlined only, no filled buttons anywhere on the site.
export default function Button({ children, href, className = '', ...rest }) {
  const Tag = href ? 'a' : 'button'
  return (
    <Tag className={`ds-button ${className}`.trim()} href={href} {...rest}>
      {children}
    </Tag>
  )
}
