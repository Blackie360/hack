import { relations } from "drizzle-orm";
import { boolean, pgEnum, pgTable, text, timestamp, unique } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified').$defaultFn(() => false).notNull(),
    image: text('image'),
    createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
    updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull()
});

export const session = pgTable("session", {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    activeOrganizationId: text('active_organization_id')
});

export const account = pgTable("account", {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull()
});

export const verification = pgTable("verification", {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()),
    updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date())
});

export const organization = pgTable("organization", {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').unique(),
    logo: text('logo'),
    createdAt: timestamp('created_at').notNull(),
    metadata: text('metadata')
});

export const role = pgEnum("role", ["member", "admin", "owner"]);

export type Role = (typeof role.enumValues)[number];

export const member = pgTable("member", {
    id: text('id').primaryKey(),
    organizationId: text('organization_id').notNull().references(() => organization.id, { onDelete: 'cascade' }),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    role: role('role').default("member").notNull(),
    createdAt: timestamp('created_at').notNull()
});

export type Organization = typeof organization.$inferSelect;

export type Member = typeof member.$inferSelect & {
    user: typeof user.$inferSelect;
};

export type User = typeof user.$inferSelect;

export const invitation = pgTable("invitation", {
    id: text('id').primaryKey(),
    organizationId: text('organization_id').notNull().references(() => organization.id, { onDelete: 'cascade' }),
    email: text('email').notNull(),
    role: role('role').default("member").notNull(),
    status: text('status').default("pending").notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    inviterId: text('inviter_id').notNull().references(() => user.id, { onDelete: 'cascade' })
});

// Relations
export const organizationRelations = relations(organization, ({ many }) => ({
    members: many(member),
    invitations: many(invitation)
}));

export const memberRelations = relations(member, ({ one }) => ({
    organization: one(organization, {
        fields: [member.organizationId],
        references: [organization.id]
    }),
    user: one(user, {
        fields: [member.userId],
        references: [user.id]
    })
}));

export const userRelations = relations(user, ({ many }) => ({
    memberships: many(member)
}));

export const invitationRelations = relations(invitation, ({ one }) => ({
    organization: one(organization, {
        fields: [invitation.organizationId],
        references: [organization.id]
    }),
    inviter: one(user, {
        fields: [invitation.inviterId],
        references: [user.id]
    })
}));

// ----------------------
// VaultSync E2EE Tables
// ----------------------

export const project = pgTable("project", {
    id: text('id').primaryKey(),
    orgId: text('org_id').notNull().references(() => organization.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
});

export const environment = pgTable("environment", {
    id: text('id').primaryKey(),
    projectId: text('project_id').notNull().references(() => project.id, { onDelete: 'cascade' }),
    name: text('name').notNull(), // e.g. dev, staging, prod
    slug: text('slug').notNull(),
    createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
});

export const secret = pgTable("secret", {
    id: text('id').primaryKey(),
    projectId: text('project_id').notNull().references(() => project.id, { onDelete: 'cascade' }),
    environmentId: text('environment_id').notNull().references(() => environment.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    ciphertext: text('ciphertext').notNull(), // base64 encoded
    nonce: text('nonce').notNull(), // base64 encoded
    aad: text('aad'), // base64/json string
    version: text('version').notNull(),
    expiresAt: timestamp('expires_at'),
    createdBy: text('created_by').notNull().references(() => user.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
}, (table) => ({
    uniqueNamePerEnv: unique().on(table.projectId, table.environmentId, table.name),
}));

export const secretVersion = pgTable("secret_version", {
    id: text('id').primaryKey(),
    secretId: text('secret_id').notNull().references(() => secret.id, { onDelete: 'cascade' }),
    version: text('version').notNull(),
    ciphertext: text('ciphertext').notNull(),
    nonce: text('nonce').notNull(),
    aad: text('aad'),
    createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
});

// Each member gets a wrapped copy of the organization's symmetric key
export const orgKeyWrap = pgTable("org_key_wrap", {
    id: text('id').primaryKey(),
    orgId: text('org_id').notNull().references(() => organization.id, { onDelete: 'cascade' }),
    memberId: text('member_id').notNull().references(() => member.id, { onDelete: 'cascade' }),
    wrappedKey: text('wrapped_key').notNull(), // base64
    createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
});

// Optional recovery using passphrase-derived KEK, owned by organization
export const orgRecovery = pgTable("org_recovery", {
    id: text('id').primaryKey(),
    orgId: text('org_id').notNull().references(() => organization.id, { onDelete: 'cascade' }),
    wrappedKeyByKEK: text('wrapped_key_by_kek').notNull(), // base64
    params: text('params').notNull(), // argon2 params JSON
    updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
});

export const auditLog = pgTable("audit_log", {
    id: text('id').primaryKey(),
    orgId: text('org_id').notNull().references(() => organization.id, { onDelete: 'cascade' }),
    actorId: text('actor_id').notNull().references(() => user.id, { onDelete: 'set null' }),
    action: text('action').notNull(),
    targetType: text('target_type').notNull(),
    targetId: text('target_id'),
    meta: text('meta'), // JSON string
    createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
});

// Relations
export const projectRelations = relations(project, ({ one, many }) => ({
    organization: one(organization, {
        fields: [project.orgId],
        references: [organization.id]
    }),
    environments: many(environment),
    secrets: many(secret)
}));

export const environmentRelations = relations(environment, ({ one, many }) => ({
    project: one(project, {
        fields: [environment.projectId],
        references: [project.id]
    }),
    secrets: many(secret)
}));

export const secretRelations = relations(secret, ({ one, many }) => ({
    project: one(project, {
        fields: [secret.projectId],
        references: [project.id]
    }),
    environment: one(environment, {
        fields: [secret.environmentId],
        references: [environment.id]
    }),
    versions: many(secretVersion)
}));

export const secretVersionRelations = relations(secretVersion, ({ one }) => ({
    secret: one(secret, {
        fields: [secretVersion.secretId],
        references: [secret.id]
    })
}));

export const orgKeyWrapRelations = relations(orgKeyWrap, ({ one }) => ({
    org: one(organization, {
        fields: [orgKeyWrap.orgId],
        references: [organization.id]
    }),
    member: one(member, {
        fields: [orgKeyWrap.memberId],
        references: [member.id]
    })
}));

export const orgRecoveryRelations = relations(orgRecovery, ({ one }) => ({
    org: one(organization, {
        fields: [orgRecovery.orgId],
        references: [organization.id]
    })
}));

// Device public keys per member (for wrapping org keys)
export const memberDeviceKey = pgTable("member_device_key", {
    id: text('id').primaryKey(),
    orgId: text('org_id').notNull().references(() => organization.id, { onDelete: 'cascade' }),
    memberId: text('member_id').notNull().references(() => member.id, { onDelete: 'cascade' }),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    publicKeyB64: text('public_key_b64').notNull(),
    createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
});

// Project-level membership (limits visibility to specific projects for non-owners)
export const projectMember = pgTable("project_member", {
    id: text('id').primaryKey(),
    projectId: text('project_id').notNull().references(() => project.id, { onDelete: 'cascade' }),
    memberId: text('member_id').notNull().references(() => member.id, { onDelete: 'cascade' }),
    role: role('role').default("member").notNull(),
    createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
});

export const projectMemberRelations = relations(projectMember, ({ one }) => ({
    project: one(project, { fields: [projectMember.projectId], references: [project.id] }),
    member: one(member, { fields: [projectMember.memberId], references: [member.id] }),
}));

// Rotation job tracking (progressive background with quorum approvals)
export const rotationJobStatus = pgEnum("rotation_status", ["pending", "active", "paused", "completed", "rolled_back", "failed"]);

export const rotationJob = pgTable("rotation_job", {
    id: text('id').primaryKey(),
    orgId: text('org_id').notNull().references(() => organization.id, { onDelete: 'cascade' }),
    initiatorId: text('initiator_id').notNull().references(() => user.id, { onDelete: 'set null' }),
    status: rotationJobStatus('status').notNull().default("pending"),
    requiredApprovals: text('required_approvals').notNull(), // JSON string: { owners: N, admins: M }
    approvalsCount: text('approvals_count').notNull().default('0'),
    createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
    updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
});

export const rotationApproval = pgTable("rotation_approval", {
    id: text('id').primaryKey(),
    jobId: text('job_id').notNull().references(() => rotationJob.id, { onDelete: 'cascade' }),
    memberId: text('member_id').notNull().references(() => member.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
});

export const rotationProgress = pgTable("rotation_progress", {
    id: text('id').primaryKey(),
    jobId: text('job_id').notNull().references(() => rotationJob.id, { onDelete: 'cascade' }),
    processedCount: text('processed_count').notNull().default('0'),
    totalCount: text('total_count').notNull().default('0'),
    lastCursor: text('last_cursor'),
    updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
});

export const rotationKeyWrap = pgTable("rotation_key_wrap", {
    id: text('id').primaryKey(),
    jobId: text('job_id').notNull().references(() => rotationJob.id, { onDelete: 'cascade' }),
    memberId: text('member_id').notNull().references(() => member.id, { onDelete: 'cascade' }),
    wrappedKey: text('wrapped_key').notNull(),
});

export const schema = { 
    user, 
    session, 
    account, 
    verification, 
    organization, 
    member, 
    invitation, 
    organizationRelations, 
    memberRelations,
    userRelations,
    invitationRelations,
    // VaultSync
    project,
    environment,
    secret,
    secretVersion,
    orgKeyWrap,
    orgRecovery,
    memberDeviceKey,
    projectMember,
    rotationJob,
    rotationApproval,
    rotationProgress,
    rotationKeyWrap,
    auditLog,
    projectRelations,
    environmentRelations,
    secretRelations,
    secretVersionRelations,
    orgKeyWrapRelations,
    orgRecoveryRelations,
    projectMemberRelations
};
