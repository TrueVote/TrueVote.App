import { createStyles, Stack, Text, Title } from '@mantine/core';
import { Helmet, HelmetData } from 'react-helmet-async';

const helmetData: any = new HelmetData({});

const useStyles: any = createStyles((theme: any) => ({
  title: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: 44,
    lineHeight: 1.2,
    fontWeight: 900,

    [theme.fn.smallerThan('xs')]: {
      fontSize: 28,
    },
  },
}));

export const Hero: any = ({
  title,
  subTitle,
}: {
  title: React.ReactNode;
  subTitle?: React.ReactNode;
}) => {
  const { classes } = useStyles();
  return (
    <>
      <Helmet helmetData={helmetData}>
        <title>{title}</title>
      </Helmet>
      <Stack>
        <Title className={classes.title}>{title}</Title>
        {subTitle && (
          <Text color='dimmed' mt='md'>
            {subTitle}
          </Text>
        )}
      </Stack>
    </>
  );
};
