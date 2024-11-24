import * as posthog from '../custom-files/posthog';

// Will identify user by usersunique id
const posthogEventCaptureSetPersonId = (event, user_id) => {
  posthog.posthog.capture(event, {
    $set: { userId: user_id },
    user_id: user_id,
  });
};

export default posthogEventCaptureSetPersonId;
