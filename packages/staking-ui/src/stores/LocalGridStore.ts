import {TablePaginationConfig} from "antd";
import {action, computed, makeAutoObservable} from "mobx";
import {DependencyList, useEffect, useMemo} from "react";

export type LocalGridStoreDataHandler<T> = (offset: number, limit: number) => Promise<[T[], boolean]>

export class LocalGridStore<T> {

  public currentPage = 0;

  public pageSize = 10;

  public items: T[] = [];

  public isLoading = false;

  public hasMore = false;

  public constructor(private readonly dataHandler: LocalGridStoreDataHandler<T>) {
    makeAutoObservable(this)
  }

  @computed
  get paginationConfig(): TablePaginationConfig {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    const config: TablePaginationConfig = {
      current: this.currentPage + 1,
      onChange(page: number, pageSize?: number) {
        // noinspection JSIgnoredPromiseFromCall
        that.changePage(page, pageSize);
      },
      pageSize: this.pageSize,
      pageSizeOptions: [
        '10', '100', '200',
      ],
      showSizeChanger: true,
    }
    if (this.items.length > this.pageSize) {
      config.total = this.items.length
    } else if (this.currentPage > 0) {
      config.total = (this.currentPage + 1) * this.pageSize + (this.hasMore ? 1 : 0)
    } else {
      config.total = this.hasMore ? this.pageSize + 1 : this.items.length
    }
    return config
  }

  @action
  async changePage(page: number, pageSize?: number): Promise<void> {
    this.currentPage = page - 1
    if (pageSize) this.pageSize = pageSize
    // if we have enough data then just open this page
    if (this.items.length > this.pageSize) {
      return
    }
    // noinspection JSIgnoredPromiseFromCall
    await this.fetchItems();
  }

  @action
  async fetchItems(): Promise<void> {
    this.isLoading = true;
    // eslint-disable-next-line prefer-const
    let [newItems, hasMore] = await this.dataHandler(this.currentPage * this.pageSize, this.pageSize);
    if (hasMore) {
      newItems = newItems.slice(0, newItems.length - 1)
    }
    this.hasMore = hasMore;
    this.items = newItems || [];
    this.isLoading = false
  }

  @action
  removeItems(): void {
    this.hasMore = false
    this.items = []
  }
}

export const useLocalGridStore = <T>(dataHandler: LocalGridStoreDataHandler<T>, deps: DependencyList | undefined = []): LocalGridStore<T> => {
  const store = useMemo(() => {
    return new LocalGridStore<T>(dataHandler);
    // eslint-disable-next-line
  }, deps)
  useEffect(() => {
    // noinspection JSIgnoredPromiseFromCall
    store.fetchItems()
    return () => store.removeItems()
  }, [store])
  return store;
}
