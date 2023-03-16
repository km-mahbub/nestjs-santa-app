import { Container } from '../components/ui/Container';
import { Request } from '../components/Request';

export function Home() {
  return (
    <div className="min-h-screen overflow-auto w-full m-0 dark: bg-gradient-to-b from-blue-300 to-green-200">
      <Container>
        <div className="space-y-6">
          <div className="text-4xl font-bold italic text-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#9b51e0] to-[#2d9cdb]">
              A letter to Santa
            </span>
          </div>
          <div className="text-2xl text-center">
            <span className="text-red-200">
              Ho ho ho, what you want for christmas?
            </span>
          </div>
        </div>
        <Request />
      </Container>
    </div>
  );
}
