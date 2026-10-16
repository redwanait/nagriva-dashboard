interface AvatarProps {
  src?: string
  alt?: string
  initials?: string
  size?: number
}

export function Avatar({ src, alt = '', initials, size = 40 }: AvatarProps) {
  if (src) {
    return (
      <img
        className="avatar avatar-image"
        src={src}
        alt={alt}
        width={size}
        height={size}
        style={{ width: size, height: size }}
      />
    )
  }

  return (
    <span
      className="avatar"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      aria-hidden="true"
    >
      {initials}
    </span>
  )
}
