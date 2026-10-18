"""Initial schema: users, user_progress, completed_topics, quiz_scores, unlocked_badges

Revision ID: 001_initial
Revises: 
Create Date: 2026-09-23 02:56:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '001_initial'
down_revision = None
branch_labels = None
depends_on = None

def upgrade() -> None:
    # 1. users table
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('password_hash', sa.String(length=255), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)

    # 2. user_progress table
    op.create_table(
        'user_progress',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('xp', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('level', sa.Integer(), nullable=False, server_default='1'),
        sa.Column('streak', sa.Integer(), nullable=False, server_default='1'),
        sa.Column('last_active_date', sa.String(length=20), nullable=False),
        sa.Column('has_run_code', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id')
    )
    op.create_index(op.f('ix_user_progress_id'), 'user_progress', ['id'], unique=False)

    # 3. completed_topics table
    op.create_table(
        'completed_topics',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('topic_id', sa.String(length=50), nullable=False),
        sa.Column('completed_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id', 'topic_id', name='uq_user_topic')
    )
    op.create_index(op.f('ix_completed_topics_id'), 'completed_topics', ['id'], unique=False)
    op.create_index(op.f('ix_completed_topics_user_id'), 'completed_topics', ['user_id'], unique=False)

    # 4. quiz_scores table
    op.create_table(
        'quiz_scores',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('quiz_id', sa.String(length=50), nullable=False),
        sa.Column('score', sa.Integer(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id', 'quiz_id', name='uq_user_quiz')
    )
    op.create_index(op.f('ix_quiz_scores_id'), 'quiz_scores', ['id'], unique=False)
    op.create_index(op.f('ix_quiz_scores_user_id'), 'quiz_scores', ['user_id'], unique=False)

    # 5. unlocked_badges table
    op.create_table(
        'unlocked_badges',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('badge_id', sa.String(length=50), nullable=False),
        sa.Column('unlocked_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id', 'badge_id', name='uq_user_badge')
    )
    op.create_index(op.f('ix_unlocked_badges_id'), 'unlocked_badges', ['id'], unique=False)
    op.create_index(op.f('ix_unlocked_badges_user_id'), 'unlocked_badges', ['user_id'], unique=False)

def downgrade() -> None:
    op.drop_table('unlocked_badges')
    op.drop_table('quiz_scores')
    op.drop_table('completed_topics')
    op.drop_table('user_progress')
    op.drop_table('users')
