import { Button, Group, Text } from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { FC } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (_page: number) => void;
}

export const Pagination: FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (_page: number) => void;
}) => {
  const renderPageNumbers = (): JSX.Element[] => {
    const pages = [];
    const showEllipsis = totalPages > 7;

    if (showEllipsis) {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current page
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(currentPage + 1, totalPages - 1);
        i++
      ) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    } else {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    }

    return pages.map((page, index) => {
      if (page === '...') {
        return (
          <Text key={`ellipsis-${index}`} className='mx-2'>
            ...
          </Text>
        );
      }

      return (
        <Button
          key={page}
          variant={currentPage === page ? 'filled' : 'light'}
          onClick={() => onPageChange(page as number)}
          size='sm'
          className='mx-1'
        >
          {page}
        </Button>
      );
    });
  };

  return (
    <Group justify='center' mt='xs' mb='xs'>
      <Button
        variant='light'
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        leftSection={<IconChevronLeft size={16} />}
        size='sm'
      >
        Previous
      </Button>

      {renderPageNumbers()}

      <Button
        variant='light'
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        rightSection={<IconChevronRight size={16} />}
        size='sm'
      >
        Next
      </Button>
    </Group>
  );
};
