import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function ApiPagination() {
  return applyDecorators(
    ApiQuery({
      name: 'page',
      description: 'Укажите с какой страницы смотреть. Default: 1',
      required: false,
      type: String,
    }),
    ApiQuery({
      name: 'limit',
      description: 'Укажите какое количество выводить. Default: 25',
      required: false,
      type: String,
    }),
    ApiQuery({
      name: 'offset',
      description: 'Смещение по выводу страниц. Default: 0',
      required: false,
      type: String,
    }),
    ApiQuery({
      name: 'sort',
      description:
        "Сортировать данные<br> <em>'asc' | 'desc' | 'ascending' | 'descending' | 1 | -1</em> ",
      required: false,
    }),
    ApiQuery({
      name: 'field',
      description:
        'Поле для сортировки: create | update | id  или поле которое вы знаете',
      required: false,
    }),
  );
}
