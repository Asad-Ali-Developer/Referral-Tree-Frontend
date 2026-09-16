import { referralsService } from "@/services/referrals.service";
import JoinForm from "./join-form";
import { apiClient } from "@/lib/api-client";

export default async function JoinPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const params = await searchParams;
  const referralCode = params.ref;

  console.log("Referral code from URL:", referralCode); // Debugging line

  if (!referralCode) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
        <div className="space-y-2 text-center">
          <h1 className="font-serif text-3xl font-semibold text-stone-900">
            Invalid Link
          </h1>

          <p className="text-stone-600">
            No referral code was provided in the URL.
          </p>
        </div>
      </div>
    );
  }

  let referralInfo;

  try {
    const response = await apiClient.get(
      `/referral-codes/${encodeURIComponent(referralCode)}`,
    );

    referralInfo = response.data;
  } catch (error) {
    console.error("Failed to fetch referral:", error);

    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
        <div className="space-y-2 text-center">
          <h1 className="font-serif text-3xl font-semibold text-stone-900">
            Invalid Referral
          </h1>

          <p className="text-stone-600">
            This referral code does not exist or has expired.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="font-serif text-3xl font-semibold text-stone-900">
            Join the Network
          </h1>

          <p className="text-stone-600">
            You were invited by{" "}
            <span className="font-semibold text-stone-900">
              {referralInfo.referrerName}
            </span>
            . Complete your registration below to connect with them.
          </p>
        </div>

        <JoinForm
          referralCode={referralCode}
          schoolId={referralInfo.schoolId}
        />
      </div>
    </div>
  );
}
