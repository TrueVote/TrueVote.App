import { Stack, Text, Title } from '@mantine/core';
import '@mantine/core/styles.css';
import { Helmet, HelmetData } from 'react-helmet-async';
import classes from './Hero.module.css';

const helmetData: any = new HelmetData({});

export const Hero: any = ({
  title,
  subTitle,
}: {
  title: React.ReactNode;
  subTitle?: React.ReactNode;
}) => {
  return (
    <>
      <Helmet helmetData={helmetData}>
        <title>{title}</title>
      </Helmet>
      <Stack>
        <Title className={classes.title}>{title}</Title>
        {subTitle && (
          <Text c='dimmed' mt='md'>
            {subTitle}
          </Text>
        )}
      </Stack>
    </>
  );
};
