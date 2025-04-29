import { IdCard, Trophy } from "lucide-react";
import { useAuth } from "@/context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Profile() {
  const { user } = useAuth();

  const getLevel = (score: number): string => {
    if (score < 200) return "[0x1][Newbie]";
    if (score < 500) return "[0x2][Scout]";
    if (score < 1000) return "[0x3][Codebreaker]";
    if (score < 1500) return "[0x4][Hacker]";
    if (score < 2000) return "[0x5][Cipher Hunter]";
    if (score < 3000) return "[0x6][Forger]";
    return "[0x7][Flag Conqueror]";
  };

  return (
    <>
      <div className="max-w-screen-2xl mx-auto w-full px-10 py-12">
        <div>
          <div>
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-start gap-6">
                  {user?.image === "" ? (
                    <img
                      src={user?.image}
                      alt={`${user?.name} avatar`}
                      className="w-7 rounded-full"
                    />
                  ) : (
                    <p className="px-10 py-8 bg-gray-200 rounded-full text-3xl">
                      {user?.name.slice(0)[0]}
                    </p>
                  )}
                  <div className="flex flex-col items-start gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold tracking-tight">
                        {user?.name}
                      </span>
                      <span className="text-primary font-medium -mb-2">
                        {getLevel(user?.totalScore as number)}
                      </span>
                    </div>
                    <Dialog>
                      <DialogTrigger className="inline-block">
                        <div className="inline-block gap-2 border rounded-md hover:bg-gray-100 border-gray-300 px-4 py-2">
                          <div className="flex items-center gap-3">
                            <IdCard strokeWidth={1.5} size={20} />
                            <p className="text-sm">Get Profile Badge</p>
                          </div>
                        </div>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Are you absolutely sure?</DialogTitle>
                          <DialogDescription>
                            This action cannot be undone. This will permanently
                            delete your account and remove your data from our
                            servers.
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
              <div className="basis-1/3 flex flex-col gap-4">
                <div className="flex items-center gap-4 w-full">
                  <div className="flex flex-col gap-1 border border-gray-300 rounded-lg px-6 py-4 w-full">
                    <p className="text-lg font-bold tracking-tight">Rank</p>
                    <div className="flex items-center gap-2">
                      <Trophy strokeWidth={1.5} size={20} />
                      <p className="text-xl font-bold">2</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 border border-gray-300 rounded-lg px-6 py-4 w-full">
                    <p className="text-lg font-bold tracking-tight">Rank</p>
                    <div className="flex items-center gap-2">
                      <Trophy strokeWidth={1.5} size={20} />
                      <p className="text-xl font-bold">2</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 w-full">
                  <div className="flex flex-col gap-1 border border-gray-300 rounded-lg px-6 py-4 w-full">
                    <p className="text-lg font-bold tracking-tight">Rank</p>
                    <div className="flex items-center gap-2">
                      <Trophy strokeWidth={1.5} size={20} />
                      <p className="text-xl font-bold">2</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 border border-gray-300 rounded-lg px-6 py-4 w-full">
                    <p className="text-lg font-bold tracking-tight">Rank</p>
                    <div className="flex items-center gap-2">
                      <Trophy strokeWidth={1.5} size={20} />
                      <p className="text-xl font-bold">2</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div></div>
          </div>
          <div></div>
        </div>
      </div>
    </>
  );
}
