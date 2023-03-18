type ButtonProps = {
  intent?: 'primary' | 'secondary' | 'danger';
  text: string;
};
export interface Props extends ButtonProps {}

export const Banner = ({ intent = 'primary', text, ...props }: Props) => {
  let banner = null;

  if (intent === 'primary') {
    banner = (
      <div className="bg-indigo-900 text-center py-4 lg:px-4">
        <div
          className="p-2 bg-indigo-800 items-center text-indigo-100 leading-none lg:rounded-full flex lg:inline-flex"
          role="alert"
        >
          <span className="flex rounded-full bg-indigo-500 uppercase px-2 py-1 text-xs font-bold mr-3">
            Hoorray!
          </span>
          <span className="font-semibold mr-2 text-left flex-auto">{text}</span>
        </div>
      </div>
    );
  } else if (intent === 'secondary') {
    banner = (
      <div
        className="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3"
        role="alert"
      >
        <p className="text-sm">{text}</p>
      </div>
    );
  } else if (intent === 'danger') {
    banner = (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <span className="block sm:inline">{text}</span>
      </div>
    );
  }
  return banner;
};
