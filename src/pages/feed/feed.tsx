import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeed, selectFeed, selectIsLoading } from '../../slices/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const feed = useSelector(selectFeed);
  const isLoading = useSelector(selectIsLoading);

  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch]);

  return (
    <>
      {isLoading ? (
        <Preloader />
      ) : (
        <FeedUI
          orders={feed.orders}
          handleGetFeeds={() => dispatch(fetchFeed())}
        />
      )}
    </>
  );
};
