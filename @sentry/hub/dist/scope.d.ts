import { Breadcrumb, Event, EventHint, EventProcessor, Scope as ScopeInterface, Severity, Span, User } from '@sentry/types';
/**
 * Holds additional event information. {@link Scope.applyToEvent} will be
 * called by the client before an event will be sent.
 */
export declare class Scope implements ScopeInterface {
    /** Flag if notifiying is happening. */
    protected _notifyingListeners: boolean;
    /** Callback for client to receive scope changes. */
    protected _scopeListeners: Array<(scope: Scope) => void>;
    /** Callback list that will be called after {@link applyToEvent}. */
    protected _eventProcessors: EventProcessor[];
    /** Array of breadcrumbs. */
    protected _breadcrumbs: Breadcrumb[];
    /** User */
    protected _user: User;
    /** Tags */
    protected _tags: {
        [key: string]: string;
    };
    /** Extra */
    protected _extra: {
        [key: string]: any;
    };
    /** Contexts */
    protected _context: {
        [key: string]: any;
    };
    /** Fingerprint */
    protected _fingerprint?: string[];
    /** Severity */
    protected _level?: Severity;
    /** Transaction */
    protected _transaction?: string;
    /** Span */
    protected _span?: Span;
    /**
     * Add internal on change listener. Used for sub SDKs that need to store the scope.
     * @hidden
     */
    addScopeListener(callback: (scope: Scope) => void): void;
    /**
     * @inheritDoc
     */
    addEventProcessor(callback: EventProcessor): this;
    /**
     * This will be called on every set call.
     */
    protected _notifyScopeListeners(): void;
    /**
     * This will be called after {@link applyToEvent} is finished.
     */
    protected _notifyEventProcessors(processors: EventProcessor[], event: Event | null, hint?: EventHint, index?: number): PromiseLike<Event | null>;
    /**
     * @inheritDoc
     */
    setUser(user: User | null): this;
    /**
     * @inheritDoc
     */
    setTags(tags: {
        [key: string]: string;
    }): this;
    /**
     * @inheritDoc
     */
    setTag(key: string, value: string): this;
    /**
     * @inheritDoc
     */
    setExtras(extras: {
        [key: string]: any;
    }): this;
    /**
     * @inheritDoc
     */
    setExtra(key: string, extra: any): this;
    /**
     * @inheritDoc
     */
    setFingerprint(fingerprint: string[]): this;
    /**
     * @inheritDoc
     */
    setLevel(level: Severity): this;
    /**
     * @inheritDoc
     */
    setTransaction(transaction?: string): this;
    /**
     * @inheritDoc
     */
    setContext(key: string, context: {
        [key: string]: any;
    } | null): this;
    /**
     * @inheritDoc
     */
    setSpan(span?: Span): this;
    /**
     * Internal getter for Span, used in Hub.
     * @hidden
     */
    getSpan(): Span | undefined;
    /**
     * Inherit values from the parent scope.
     * @param scope to clone.
     */
    static clone(scope?: Scope): Scope;
    /**
     * @inheritDoc
     */
    clear(): this;
    /**
     * @inheritDoc
     */
    addBreadcrumb(breadcrumb: Breadcrumb, maxBreadcrumbs?: number): this;
    /**
     * @inheritDoc
     */
    clearBreadcrumbs(): this;
    /**
     * Applies fingerprint from the scope to the event if there's one,
     * uses message if there's one instead or get rid of empty fingerprint
     */
    private _applyFingerprint;
    /**
     * Applies the current context and fingerprint to the event.
     * Note that breadcrumbs will be added by the client.
     * Also if the event has already breadcrumbs on it, we do not merge them.
     * @param event Event
     * @param hint May contain additional informartion about the original exception.
     * @hidden
     */
    applyToEvent(event: Event, hint?: EventHint): PromiseLike<Event | null>;
}
/**
 * Add a EventProcessor to be kept globally.
 * @param callback EventProcessor to add
 */
export declare function addGlobalEventProcessor(callback: EventProcessor): void;
//# sourceMappingURL=scope.d.ts.map