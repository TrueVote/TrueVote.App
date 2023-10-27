import { NostrProfile, getNostrPublicKey, getUserProfileInfo } from '@/services/NostrHelper';
import { Hero } from '@/ui/Hero';
import classes from '@/ui/shell/AppStyles.module.css';
import { Container, Space, Stack, Text } from '@mantine/core';
import { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export const Profile: FC = () => {
  const nostrPublicKey: string | null = getNostrPublicKey();
  const [profile, setProfile] = useState<NostrProfile | undefined>(undefined);

  useEffect(() => {
    if (nostrPublicKey === null || String(nostrPublicKey).length <= 0) {
      return;
    }
    // Define an async function to fetch the user profile
    const fetchUserProfile: any = async () => {
      try {
        const userProfile: NostrProfile | undefined = await getUserProfileInfo(nostrPublicKey);
        setProfile(userProfile);
        console.info('Returned Back', userProfile);
      } catch (error) {
        // Handle any errors, e.g., show an error message
        console.error('Error fetching user profile:', error);
      }
    };

    // Call the async function
    fetchUserProfile();
  });

  return (
    <Container size='xs' px='xs' className={classes.container}>
      <Stack gap={32}>
        <Hero title='Profile' />
      </Stack>
      {profile !== undefined && String(profile.name).length > 0 ? (
        <>
          <Text>Signed In Key: {nostrPublicKey}</Text>
          <Space h='md'></Space>
          <Text>
            {profile.name} - {profile.avatar} - {profile.bio}
          </Text>
          <Space h='md'></Space>
          <Link className={classes.pagelinkActive} to='/signout'>
            Sign Out
          </Link>
        </>
      ) : (
        <>
          <Stack>
            <Link className={classes.pagelinkActive} to='/signin'>
              Sign In
            </Link>
            <Link className={classes.pagelinkActive} to='/register'>
              Register
            </Link>
          </Stack>
        </>
      )}
    </Container>
  );
};
