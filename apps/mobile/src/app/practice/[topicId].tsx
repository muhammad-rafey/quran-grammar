import { ScrollView, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Action, Label } from '@/components/study-ui';
import { useTopics } from '@/state/content-hooks';
import { useInterface } from '@/state/preferences-provider';
import { PracticeSession } from '@/screens/practice-grammar';
import { validTopicId } from '@/screens/topic-screen';

export default function TopicPracticeRoute() {
  const params = useLocalSearchParams<{ topicId: string }>();
  const topicId = validTopicId(params.topicId);
  const { ui } = useInterface();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topics = useTopics();
  const close = () => (router.canGoBack() ? router.back() : router.replace('/'));
  const container = {
    padding: 18,
    paddingBottom: Math.max(insets.bottom, 20),
    gap: 16,
    width: '100%',
    maxWidth: 760,
    alignSelf: 'center',
  } as const;
  if (!topicId)
    return (
      <View style={container}>
        <Label>{ui.notFound}</Label>
        <Action onPress={close}>{ui.backToStudy}</Action>
      </View>
    );
  return (
    <ScrollView
      testID="topic-practice"
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={container}
    >
      <PracticeSession
        active={{ kind: 'topic', id: topicId }}
        topic={topics.data?.find((topic) => topic.id === topicId)}
        onExit={close}
        exitLabel={ui.close}
        onWord={(id) => router.push({ pathname: '/word/[id]', params: { id, preview: '1' } })}
      />
    </ScrollView>
  );
}
