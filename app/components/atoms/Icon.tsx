import google from '../../assets/images/icons/google.svg';
import youtube from '../../assets/images/icons/youtube.svg';
import verticalDots from '../../assets/images/icons/dots.svg';
const icons = {
  google,
  youtube,
  verticalDots,
};
function Icon({ name, className }: { name: keyof typeof icons; className?: string }) {
  return (
    <svg className={className}>
      <use href={icons[name]} />
    </svg>
  );
}
export default Icon;
