import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'bienvuimmo-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      // Informations personnelles
      firstName,
      lastName,
      email,
      phone,
      password,
      // Informations agence
      agencyName,
      agencyAddress,
      agencyCity,
      agencyPostalCode,
      siret,
      carteT,
      // Plan
      plan,
    } = body;

    // Validation des champs requis
    if (!firstName || !lastName || !email || !password || !agencyName) {
      return NextResponse.json(
        { error: 'Tous les champs obligatoires doivent être remplis' },
        { status: 400 }
      );
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      );
    }

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé' },
        { status: 409 }
      );
    }

    // Vérifier si le SIRET existe déjà
    if (siret) {
      const existingAgency = await prisma.agency.findUnique({
        where: { siret },
      });

      if (existingAgency) {
        return NextResponse.json(
          { error: 'Ce numéro SIRET est déjà enregistré' },
          { status: 409 }
        );
      }
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Mapper le plan
    const planMap: Record<string, 'FREE' | 'PRO' | 'BUSINESS'> = {
      starter: 'FREE',
      pro: 'PRO',
      enterprise: 'BUSINESS',
    };

    // Créer l'agence et l'utilisateur admin en transaction
    const result = await prisma.$transaction(async (tx) => {
      // Créer l'agence
      const agency = await tx.agency.create({
        data: {
          name: agencyName,
          email: email.toLowerCase(),
          phone: phone || null,
          address: agencyAddress 
            ? `${agencyAddress}, ${agencyPostalCode} ${agencyCity}`
            : null,
          siret: siret || null,
          plan: planMap[plan] || 'FREE',
        },
      });

      // Créer l'utilisateur admin de l'agence
      const user = await tx.user.create({
        data: {
          email: email.toLowerCase(),
          password: hashedPassword,
          firstName,
          lastName,
          phone: phone || null,
          role: 'ADMIN',
          agencyId: agency.id,
        },
      });

      return { agency, user };
    });

    // Créer le token JWT
    const token = jwt.sign(
      {
        userId: result.user.id,
        email: result.user.email,
        role: result.user.role,
        agencyId: result.agency.id,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Réponse avec token et infos
    const response = NextResponse.json({
      success: true,
      message: 'Compte créé avec succès',
      token,
      user: {
        id: result.user.id,
        email: result.user.email,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        role: result.user.role,
        agency: {
          id: result.agency.id,
          name: result.agency.name,
          plan: result.agency.plan,
        },
      },
    });

    // Définir le cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du compte' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
