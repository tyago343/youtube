import { Sanction } from 'src/modules/sanctions/domain/sanction.entity';
import { SanctionSchema } from '../entities/sanction.schema';

export class SanctionMapper {
  static toPersistence(sanction: Sanction): SanctionSchema {
    const schema = new SanctionSchema();
    const primitives = sanction.toPrimitives();

    schema.id = primitives.id;
    schema.sanctionType = primitives.sanctionType;
    schema.targetType = primitives.targetType ?? undefined;
    schema.targetId = primitives.targetId ?? undefined;
    schema.messageBody = primitives.messageBody;
    schema.appliedByUserId = primitives.appliedByUserId;
    schema.appliedAt = primitives.appliedAt;
    schema.expiresAt = primitives.expiresAt ?? undefined;

    return schema;
  }

  static toDomain(schema: SanctionSchema, reportIds: string[]): Sanction {
    return Sanction.fromPersistence({
      id: schema.id,
      reportIds,
      sanctionType: schema.sanctionType,
      targetType: schema.targetType ?? null,
      targetId: schema.targetId ?? null,
      messageBody: schema.messageBody,
      appliedByUserId: schema.appliedByUserId,
      appliedAt: schema.appliedAt,
      expiresAt: schema.expiresAt ?? null,
    });
  }
}
