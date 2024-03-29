import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, ActivityIndicator } from 'react-native';
import { KeyboardAwareView } from 'react-native-keyboard-aware-view';
// import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import { useColorScheme } from 'react-native-appearance';
import FeedItem from '../../FeedItem/FeedItem';
import CommentItem from './CommentItem';
import CommentInput from './CommentInput';
import TNMediaViewerModal from '../../../Core/truly-native/TNMediaViewerModal';
import dynamicStyles from './styles';

function DetailPost(props) {
  const {
    feedItem,
    feedItems,
    commentItems,
    onCommentSend,
    scrollViewRef,
    onMediaPress,
    onReaction,
    onOtherReaction,
    shouldUpdate,
    onMediaClose,
    isMediaViewerOpen,
    selectedMediaIndex,
    onFeedUserItemPress,
    onSharePost,
    onDeletePost,
    onUserReport,
    user,
    commentsLoading,
  } = props;
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(colorScheme);

  const onCommentPress = () => {
    console.log('comment');
  };

  return (
    <KeyboardAwareView style={styles.detailPostContainer}>
      <ScrollView ref={scrollViewRef}>
        <FeedItem
          item={feedItem}
          onUserItemPress={onFeedUserItemPress}
          onCommentPress={onCommentPress}
          onMediaPress={onMediaPress}
          onReaction={onReaction}
          shouldUpdate={shouldUpdate}
          onSharePost={onSharePost}
          onDeletePost={onDeletePost}
          onUserReport={onUserReport}
          user={user}
        />
        {commentsLoading ? (
          <ActivityIndicator style={{ marginVertical: 7 }} size="small" />
        ) : (
            commentItems.map((comment, index) => <CommentItem item={comment} key={index} />)
          )}
      </ScrollView>
      <CommentInput onCommentSend={onCommentSend} />
      <TNMediaViewerModal
        mediaItems={feedItems}
        isModalOpen={isMediaViewerOpen}
        onClosed={onMediaClose}
        selectedMediaIndex={selectedMediaIndex}
      />
    </KeyboardAwareView>
  );
}

DetailPost.propTypes = {
  item: PropTypes.object,
  scrollViewRef: PropTypes.any,
  onMediaPress: PropTypes.func,
  onOtherReaction: PropTypes.func,
  onReaction: PropTypes.func,
  onFeedUserItemPress: PropTypes.func,
  onMediaClose: PropTypes.func,
  shouldUpdate: PropTypes.bool,
  feedItems: PropTypes.array,
  isMediaViewerOpen: PropTypes.bool,
  selectedMediaIndex: PropTypes.number,
};

export default DetailPost;
