import { db } from '../db/index';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import type { User, LoginDTO, SignupDTO } from '@sint-dashboard/shared';

export class AuthService {
  async signup(data: SignupDTO): Promise<User> {
    const existingUser = await db.select()
      .from(users)
      .where(eq(users.email, data.email))
      .limit(1);
    
    if (existingUser.length > 0) {
      throw new Error('Email already exists');
    }
    
    const password_hash = await bcrypt.hash(data.password, 10);
    
    const [user] = await db.insert(users).values({
      email: data.email,
      name: data.name,
      password_hash,
    }).returning();
    
    const { password_hash: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  async login(data: LoginDTO): Promise<User | null> {
    const [user] = await db.select()
      .from(users)
      .where(eq(users.email, data.email))
      .limit(1);
    
    if (!user) {
      return null;
    }
    
    const isValid = await bcrypt.compare(data.password, user.password_hash);
    
    if (!isValid) {
      return null;
    }
    
    const { password_hash: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  async getUserById(userId: string): Promise<User | null> {
    const [user] = await db.select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    
    if (!user) {
      return null;
    }
    
    const { password_hash: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }
}
