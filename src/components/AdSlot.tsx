type Props = {
  label?: string;
  className?: string;
};

export default function AdSlot({
  label = "Advertisement",
  className = "",
}: Props) {
  return (
    <div className={`ad ${className}`} role="note">
      <span>{label}</span>
    </div>
  );
}
