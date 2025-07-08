'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useUserRole } from '@/hooks/useUserRole';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import { QUICK_ACTIONS } from '@/constants';
import { api } from '../../../../convex/_generated/api';
import ActionCard from '@/components/ActionCard';
import MeetingModal from '@/components/ui/MeetingModel';
import LoaderUI from '@/components/LoaderUI';
import { Loader2Icon } from 'lucide-react';
import MeetingCard from '@/components/MeetingCard';
import { Button } from '@/components/ui/button';

const Home = () => {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { isInterviewer, isCandidate, isLoading } = useUserRole();
  const interviews = useQuery(api.interviews.getMyInterviews);
  const syncUser = useMutation(api.users.syncUser);
  const setUserRole = useMutation(api.users.setUserRole);


  const [roleSelected, setRoleSelected] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"start" | "join">();

  useEffect(() => {
    // If already has role, skip role selection screen
    if (isInterviewer || isCandidate) {
      setRoleSelected(true);
    }
  }, [isInterviewer, isCandidate]);

  const handleRoleSelection = async (role: "interviewer" | "candidate") => {
  if (!user?.id || !user.primaryEmailAddress?.emailAddress) return;

  // Step 1: Sync user to Convex DB (creates user if not present)
  await syncUser({
    name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
    email: user.primaryEmailAddress.emailAddress,
    clerkId: user.id,
    image: user.imageUrl,
  });
  // Step 2: Now safely update role
  await setUserRole({
    clerkId: user.id,
    role,
  });

  setRoleSelected(true);
};

  const handleQuickAction = (title: string) => {
    switch (title) {
      case "New Call":
        setModalType("start");
        setShowModal(true);
        break;
      case "Join Interview":
        setModalType("join");
        setShowModal(true);
        break;
      default:
        router.push(`/${title.toLowerCase()}`);
    }
  };

  if (!isLoaded || isLoading) return <LoaderUI />;

  if (!roleSelected) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen space-y-6'>
        <h1 className='text-3xl font-bold'>Who are you?</h1>
        <div className='space-x-4'>
          <Button onClick={() => handleRoleSelection('interviewer')}>
            Interviewer
          </Button>
          <Button variant='outline' onClick={() => handleRoleSelection('candidate')}>
            Candidate
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='container max-w-7xl mx-auto p-6'>
      <div className="rounded-lg bg-card p-6 border shadow-sm mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
          Welcome back!
        </h1>
        <p className="text-muted-foreground mt-2">
          {isInterviewer
            ? "Manage your interviews and review candidates effectively"
            : "Access your upcoming interviews and preparations"}
        </p>
      </div>

      {isInterviewer ? (
        <>
          <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {QUICK_ACTIONS.map((action) => (
              <ActionCard
                key={action.title}
                action={action}
                onClick={() => handleQuickAction(action.title)}
              />
            ))}
          </div>

          <MeetingModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title={modalType === "join" ? "Join Meeting" : "Start Meeting"}
            isJoinMeeting={modalType === "join"}
          />
        </>
      ) : (
        <>
          <div>
            <h1 className="text-3xl font-bold">Your Interviews</h1>
            <p className="text-muted-foreground mt-1">View and join your scheduled interviews</p>
          </div>

          <div className="mt-8">
            {interviews === undefined ? (
              <div className="flex justify-center py-12">
                <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : interviews.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {interviews.map((interview) => (
                  <MeetingCard key={interview._id} interview={interview} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                You have no scheduled interviews at the moment
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
