import { useLocalSearchParams } from 'expo-router';
import { PracticeScreen } from '@/screens/practice-grammar';
import { validTopicId } from '@/screens/topic-screen';

export default function TopicPracticeRoute() {
  const params = useLocalSearchParams<{ topicId: string }>();
  const topicId = validTopicId(params.topicId);
  return <PracticeScreen active={topicId ? { kind: 'topic', id: topicId } : null} />;
}
